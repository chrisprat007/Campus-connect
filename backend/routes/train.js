import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/:departmentId", (req, res) => {
  const { departmentId } = req.params;
  const scriptPath = path.join(__dirname, "../../ml/placement_model.py");

  const pythonProcess = spawn(process.platform === "win32" ? "python" : "python3", [scriptPath, departmentId]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        const jsonResponse = JSON.parse(output);
        res.status(200).json({ message: "Training complete", output: jsonResponse });
      } catch (err) {
        res.status(500).json({ error: "Invalid JSON response from Python script", rawOutput: output });
      }
    } else {
      res.status(500).json({ error: "Python script failed", details: errorOutput });
    }
  });
});

export default router;
