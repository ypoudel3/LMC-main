import { useState } from "react";
import axios from "axios";
type BodyProps = {
  scrollToBody2: () => void;
};

export default function Body({ scrollToBody2 }: BodyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // shared states for both forms
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  // ---------- Login ----------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setStatus("✅ Login successful!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Login failed. Check email/password.");
    }
  };

  // ---------- Signup ----------
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await axios.post("/api/auth/signup", { username, email, password });
    setStatus("✅ Signup successful! You can now log in.");
    setUsername("");
    setEmail("");
    setPassword("");
    setShowSignUp(false);
  } catch (err: any) {
    console.error(err);
    if (err.response?.data?.error) {
      setStatus("❌ " + err.response.data.error);
    } else {
      setStatus("❌ Signup failed. Try again.");
    }
  }
};


  return (
    <>
      <div className="relative">
        {/* Navbar */}
        <div className="fixed top-0 z-50 w-full flex flex-row justify-between pt-3 pb-3 px-7 md:px-12 bg-black/90 brightness-90">
          <div className="text-white flex flex-row items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <div>L-MCM</div>
          </div>


          <div className="flex justify-center">
            <ul className="flex gap-6 text-white">
              <li>Home</li>
        <a href="/legal" target="_self">Legal Help</a>
          <a href="/expense" target="_self">Track Expenses</a>
          <a href="/reportform" target="_self">Report Abuse</a>            </ul>
          </div>

          <div className="text-white">
            <i
              className="fa-regular fa-user cursor-pointer"
              onClick={() => setIsOpen(true)}
            ></i>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-screen">
          <img
            src="b1.jpg"
            alt="Background"
            className="w-full h-full object-cover brightness-50"
          />

          <div className="absolute inset-0 flex flex-col items-start justify-center text-left text-white px-4 pt-16">
            <div className="px-7 md:px-20">
              <div className="text-4xl md:text-5xl font-bold">
                Support & Safety for
              </div>
              <div className="text-4xl md:text-5xl font-bold mt-2">
                Nepali Migrant Workers
              </div>
              <div className="text-4xl md:text-5xl font-bold mt-2">
                Around the World
              </div>

              <p className="text-lg md:text-xl max-w-2xl mt-3 text-gray-100">
                Emergency support, legal assistance, and financial tools all in
                one easy to use platform.
              </p>
              <button
                className="mt-14 rounded-full mx-1 px-3 h-10 bg-white hover:scale-105 text-gray-700"
                onClick={scrollToBody2}
              >
                Discover More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-300/20 backdrop-blur-md border border-white p-6 rounded-xl shadow-xl max-w-md w-full">
            {showSignUp ? (
              // ---------- Sign Up ----------
              <form onSubmit={handleSignup} className="flex flex-col items-center">
                <i
                  className="fa-solid fa-arrow-left text-2xl mb-4 cursor-pointer self-start text-white"
                  onClick={() => setShowSignUp(false)}
                ></i>
                <h1 className="text-2xl mb-4 text-white font-bold">Sign up</h1>

                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent border-b-2 text-white w-full h-12"
                  />
                  <i className="fa-regular fa-user text-white absolute right-3 top-1/2 transform -translate-y-1/2"></i>
                </div>

                <div className="relative w-full mt-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-b-2 text-white w-full h-12"
                  />
                  <i className="fa-regular fa-envelope text-white absolute right-3 top-1/2 transform -translate-y-1/2"></i>
                </div>

                <div className="relative w-full mt-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-b-2 text-white w-full h-12"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-white absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M4.5 10.5h15v9a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 19.5v-9z"
                    />
                  </svg>
                </div>

                <div className="flex text-white mt-8 gap-2">
                  <input type="checkbox" className="w-4 cursor-pointer" />{" "}
                  <span className="text-gray-400">I agree to the</span>
                  <a href="#" className="underline">
                    terms & conditions
                  </a>
                </div>

                <button
                  type="submit"
                  className="rounded-full w-28 h-10 mt-8 bg-white"
                >
                  Sign up
                </button>
              </form>
            ) : (
              // ---------- Login ----------
              <form onSubmit={handleLogin} className="flex flex-col items-center">
                <i
                  className="fa-solid fa-arrow-left text-2xl mb-4 cursor-pointer self-start text-white"
                  onClick={() => setIsOpen(false)}
                ></i>
                <h1 className="text-2xl mb-4 font-bold text-white">Log in</h1>

                <div className="relative w-full mt-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-b-2 text-white w-full h-12"
                  />
                  <i className="fa-regular fa-envelope text-white absolute right-3 top-1/2 transform -translate-y-1/2"></i>
                </div>

                <div className="relative w-full mt-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-b-2 text-white w-full h-12"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-white absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M4.5 10.5h15v9a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 19.5v-9z"
                    />
                  </svg>
                </div>

                <div className="flex flex-row mt-4 justify-between w-full">
                  <div className="flex gap-1 text-gray-400">
                    <input type="checkbox" /> Remember me
                  </div>
                  <div className="text-white">Forgot password</div>
                </div>

                <button
                  type="submit"
                  className="rounded-full w-28 h-10 mt-4 bg-white"
                >
                  Log in
                </button>

                <div className="flex mt-4">
                  <div className="text-gray-400">Don't have an account?</div>
                  <div
                    className="text-white cursor-pointer ml-2 font-bold"
                    onClick={() => setShowSignUp(true)}
                  >
                    Sign up
                  </div>
                </div>
              </form>
            )}

            {/* Status Message */}
            {status && (
              <p className="mt-4 text-center text-sm text-white">{status}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
