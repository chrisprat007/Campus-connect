// models/SemanticDocument.js
import mongoose from "mongoose";

const semanticSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel"
    },

    ownerModel: {
      type: String,
      required: true,
      enum: ["Student", "User"]
    },

    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    refModel: {
      type: String,
      enum: [
        "Project",
        "Internship",
        "Certification",
        "Achievement",
        "Interview"
      ],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    embedding: {
      type: [Number],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("SemanticDocument", semanticSchema);