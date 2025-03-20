import { useState } from "react";
import api from "../../../utils/api";

export default function CreateDepartment({ cityId, onSuccess }) {
  const [name, setName] = useState("CSE");
  const [role, setRole] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [confirmSecretKey, setConfirmSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const names = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "CHE", "BME", "AE", "AUTO", "BT", "IE", "MNE", "MT", "RA", "DSAI"];


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (secretKey !== confirmSecretKey) {
      setError("Secret key and confirm secret key must match");
      setLoading(false);
      return;
    }

    try {
      const payload = { name, role, college: cityId, secretKey,tasks:[] };
      console.log(payload);
      await api.post("/departments/add", payload);
      setName("CSE");
      setRole("");
      setSecretKey("");
      setConfirmSecretKey("");
      onSuccess();
    } catch (err) {
      console.error("Error creating department:", err);
      setError("Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Create Department</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300">Department Name</label>
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {names.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter department role"
          />
        </div>

        <div>
          <label className="block text-gray-300">Secret Key</label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter secret key"
          />
        </div>

        <div>
          <label className="block text-gray-300">Confirm Secret Key</label>
          <input
            type="password"
            value={confirmSecretKey}
            onChange={(e) => setConfirmSecretKey(e.target.value)}
            required
            className="w-full p-2 mt-1 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirm secret key"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Department"}
        </button>
      </form>
    </div>
  );
}
