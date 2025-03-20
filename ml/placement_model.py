import sys
import numpy as np
import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
from sklearn.ensemble import RandomForestRegressor
import json

def to_float(val):
    try:
        return float(val)
    except Exception:
        return np.nan

client = MongoClient("mongodb://localhost:27017/")
db = client["college_cooperation"]

placements = list(db["placements"].find({}))
if len(placements) == 0:
    sys.exit("No placement data available")
df = pd.DataFrame(placements)
df = df.dropna(subset=["salary"])
if df.empty:
    sys.exit("No valid placement data available")

# Prepare training data from placement features
X_train = pd.json_normalize(df["features"])
# Ensure training columns are numeric
X_train['cgpa'] = pd.to_numeric(X_train['cgpa'], errors='coerce')
X_train['projects'] = pd.to_numeric(X_train['projects'], errors='coerce')
X_train['internships'] = pd.to_numeric(X_train['internships'], errors='coerce')
y = pd.to_numeric(df["salary"], errors='coerce')

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y)

# Convert department argument to ObjectId for matching Student documents
dept = ObjectId(sys.argv[1])
students = list(db["students"].find({"department": dept}))

features_list = []
ids = []
for s in students:
    # Extract features from top-level student fields and convert to float
    feat = {
        "cgpa": to_float(s.get("cgpa", np.nan)),
        "projects": to_float(s.get("projects", np.nan)),
        "internships": to_float(s.get("internships", np.nan))
    }
    # Skip student if all feature values are NaN
    if np.isnan(feat["cgpa"]) and np.isnan(feat["projects"]) and np.isnan(feat["internships"]):
        continue
    ids.append(s["_id"])
    features_list.append(feat)

if not features_list:
    print(json.dumps({"status": "success", "message": "No student features available for prediction"}))
    sys.exit(0)

X_new = pd.DataFrame(features_list)
# Reindex to match the training DataFrame's columns
X_new = X_new.reindex(columns=X_train.columns)
# Fill missing values with the training set's column means
X_new = X_new.fillna(X_train.mean())

try:
    preds = model.predict(X_new)
    for _id, pred in zip(ids, preds):
        db["students"].update_one({"_id": _id}, {"$set": {"predictedSalary": float(pred)}})
    print(json.dumps({"status": "success", "message": "Training and prediction complete"}))
except Exception as e:
    print(json.dumps({"status": "error", "message": str(e)}))
