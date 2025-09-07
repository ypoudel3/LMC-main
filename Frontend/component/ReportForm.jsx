import React, { useState } from "react";
import axios from "axios";
import Footer from './Footer.jsx';
import Navbar from "./Navbar";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const anonymousId = generateAnonymousId();
      const data = new FormData();
      data.append("anonymousId", anonymousId);
      data.append("category", formData.category);
      data.append("severity", formData.severity);
      data.append("employer", formData.employer);
      data.append("location", formData.location);
      data.append("description", formData.description);

      formData.files.forEach((file) => {
        data.append("files", file);
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
      setStatus(
        err.response?.data?.message || "Failed to submit report. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar />

      {/* Form Container */}
    <div className="min-h-screen mt-10 bg-gray-50 py-8">
      <div className="mt-2 mb-2 max-w-xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Flag Unsafe Employers / Frauds Anonymously
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-gray-700">
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-gray-700">
            Severity:
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select severity</option>
              {severityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-gray-700">
            Employer / Company Name:
            <input
              type="text"
              name="employer"
              value={formData.employer}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Description of Issue:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Upload Evidence (optional):
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1"
            />
          </label>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Submit Report
          </button>
        </form>

        {status && <p className="mt-4 text-gray-800">{status}</p>}
      </div>
      </div>
      <Footer />
    </>
  );
}
