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
      {/* Navbar */}
      <div className="fixed top-0 z-50 w-full flex justify-between items-center py-3 px-7 md:px-12 bg-black/90 brightness-90">
        <div className="text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <span className="font-semibold text-lg">L-MCM</span>
        </div>

        <ul className="flex gap-6 text-white">
          <a href="/app" className="hover:underline">
            Home
          </a>
          <a href="/legal" className="hover:underline">
            Legal Help
          </a>
          <a href="/expense" className="hover:underline">
            Track Expenses
          </a>
          <a href="/reportform" className="hover:underline">
            Report Abuse
          </a>
        </ul>

        <div className="text-white cursor-pointer">
          <i className="fa-regular fa-user"></i>
        </div>
      </div>

      {/* Form Container */}
      <div className="mt-24 max-w-xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
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
    </>
  );
}
