import React, { useState } from "react";
import axios from "axios";

const categories = [
  "Wage Theft",
  "Harassment",
  "Unsafe Working Conditions",
  "Fraud / Scams",
  "Other",
];

const severityLevels = ["Low", "Medium", "High", "Critical"];

// Browser-safe anonymous ID generator
const generateAnonymousId = () => {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    return array.join("-");
  } else {
    return Date.now().toString() + "-" + Math.floor(Math.random() * 1e9);
  }
};

export default function ReportForm() {
  const [formData, setFormData] = useState({
    category: "",
    severity: "",
    employer: "",
    location: "",
    description: "",
    files: [],
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, files: Array.from(e.target.files) }));
    }
  };

const generateAnonymousId = () => {
  // Use crypto API available in browsers
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    return array.join("-"); // returns something like "123456789-987654321-..."
  } else {
    // Fallback for older browsers
    return Date.now().toString() + "-" + Math.floor(Math.random() * 1e9);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("Submitting...");

  try {
    const anonymousId = generateAnonymousId(); // now browser-safe
    const data = new FormData();
    data.append("anonymousId", anonymousId);
    data.append("category", formData.category);
    data.append("severity", formData.severity);
    data.append("employer", formData.employer);
    data.append("location", formData.location);
    data.append("description", formData.description);

    formData.files.forEach((file) => {
      data.append("files", file); // keep field name "files"
    });

    const response = await axios.post("/api/reports", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Backend response:", response.data);
    setStatus(response.data.message);

    setFormData({
      category: "",
      severity: "",
      employer: "",
      location: "",
      description: "",
      files: [],
    });
  } catch (err) {
    console.error("Submission error:", err.response?.data || err.message);
    setStatus(err.response?.data?.message || "Failed to submit report. Please try again.");
  }
};


  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Flag Unsafe Employers / Frauds Anonymously</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <br /><br />

        <label>
          Severity:
          <select name="severity" value={formData.severity} onChange={handleChange} required>
            <option value="">Select severity</option>
            {severityLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>
        <br /><br />

        <label>
          Employer / Company Name:
          <input type="text" name="employer" value={formData.employer} onChange={handleChange} required />
        </label>
        <br /><br />

        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </label>
        <br /><br />

        <label>
          Description of Issue:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <br /><br />

        <label>
          Upload Evidence (optional):
          <input type="file" multiple onChange={handleFileChange} />
        </label>
        <br /><br />

        <button type="submit" style={{ padding: "0.5rem 1rem", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Submit Report
        </button>
      </form>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}
