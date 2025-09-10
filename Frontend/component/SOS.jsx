import axios from "axios";
import { useState } from "react";

export default function SOS() {
  const [status, setStatus] = useState(""); // notification message
  const [showNotification, setShowNotification] = useState(false); // toggle popup

  const sendSOS = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("❌ You must be logged in to send SOS.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/send-sos",
        {
          message: "Emergency! Please help me.",
          location: { lat: "27.7172", lng: "85.3240" }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      showToast(response.data.status || "✅ SOS sent successfully!");
    } catch (error) {
      console.error("Error sending SOS:", error);
      showToast("❌ Error sending SOS.");
    }
  };

  const showToast = (message) => {
    setStatus(message);
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <>
      {/* SOS Button fixed at bottom-right */}
      <button
        className="fixed bottom-5 right-5 z-50 h-16 w-16 flex items-center justify-center rounded-full bg-red-600
        text-white font-semibold shadow-2xl shadow-gray-400 transition-transform hover:scale-125"
        onClick={sendSOS}
      >
        SOS
      </button>

      {/* Popup Notification */}
      {showNotification && (
        <div className="fixed bottom-24 right-5 z-50 px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg animate-fade-in-out">
          {status}
        </div>
      )}

      {/* Tailwind Animation (fade in/out) */}
      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease forwards;
        }
      `}</style>
    </>
  );
}
