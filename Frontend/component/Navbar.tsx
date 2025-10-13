import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // for mobile menu
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // for login/signup modal
  const [showSignUp, setShowSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Restore session if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserInitial(storedUser.charAt(0).toUpperCase());
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.username || email);
      setUserInitial((response.data.username || email).charAt(0).toUpperCase());
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      setStatus("✅ Login successful!");
    } catch {
      setStatus("❌ Login failed. Check email/password.");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", { username, email, password });
      setStatus("✅ Signup successful! You can now log in.");
      setShowSignUp(false);
    } catch {
      setStatus("❌ Signup failed. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 z-50 w-full flex flex-row justify-between pt-3 pb-3 px-7 md:px-12 bg-black">
        {/* Logo */}
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

        {/* Desktop menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6 text-white">
            <a href="/app">Home</a>
            <a href="/legal">Legal Help</a>
            <a href="/expense">Track Expenses</a>
            <a href="/reportform">Report Abuse</a>
          </ul>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3">
        <div className="md:hidden flex">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <div className="flex md:hidden text-white relative ml-4">
          {!isLoggedIn ? (
            <i
              className="fa-regular fa-user cursor-pointer text-lg"
              onClick={() => setIsAuthModalOpen(true)}
            ></i>
          ) : (
            <div
              className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center font-bold cursor-pointer right-0"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {userInitial}
            </div>
          )}

          {showDropdown && (
            <div className="absolute top-0 right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg ">
              <div
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={handleLogout}
              >
                Log out
              </div>
            </div>
          )}
        </div>
      </div>

        {/* User section */}
        <div className="hidden md:flex text-white relative ml-4">
          {!isLoggedIn ? (
            <i
              className="fa-regular fa-user cursor-pointer"
              onClick={() => setIsAuthModalOpen(true)}
            ></i>
          ) : (
            <div
              className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center font-bold cursor-pointer right-0"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {userInitial}
            </div>
          )}

          {showDropdown && (
            <div className="absolute top-0 right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg ">
              <div
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={handleLogout}
              >
                Log out
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <>
        <div className="md:hidden bg-gray-50 shadow-lg mt-11">
          <a href="/app" className="block px-4 py-2 hover:bg-gray-200 text-black">
            Home
          </a>
          <a href="/legal" className="block px-4 py-2 hover:bg-gray-200 text-black">
            Legal Help
          </a>
          <a href="/expense" className="block px-4 py-2 hover:bg-gray-200 text-black">
            Track Expenses
          </a>
          <a href="/reportform" className="block px-4 py-2 hover:bg-gray-200 text-black">
            Report Abuse
          </a>
        </div>
        
        </>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && !isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-300/20 backdrop-blur-md border border-white p-6 rounded-xl shadow-xl max-w-md w-full">
            {showSignUp ? (
              <form onSubmit={handleSignup} className="flex flex-col items-center">
                <i
                  className="fa-solid fa-arrow-left text-2xl mb-4 cursor-pointer self-start text-white"
                  onClick={() => setShowSignUp(false)}
                ></i>
                <h1 className="text-2xl mb-4 text-white font-bold">Sign up</h1>

                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-b-2 text-white w-full h-12 mt-3"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-b-2 text-white w-full h-12 mt-3"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-b-2 text-white w-full h-12 mt-3"
                />

                <button type="submit" className="rounded-full w-28 h-10 mt-8 bg-white">
                  Sign up
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="flex flex-col items-center">
                <i
                  className="fa-solid fa-arrow-left text-2xl mb-4 cursor-pointer self-start text-white"
                  onClick={() => setIsAuthModalOpen(false)}
                ></i>
                <h1 className="text-2xl mb-4 font-bold text-white">Log in</h1>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-b-2 text-white w-full h-12 mt-3"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-b-2 text-white w-full h-12 mt-3"
                />

                <button type="submit" className="rounded-full w-28 h-10 mt-4 bg-white">
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

            {status && <p className="mt-4 text-center text-sm text-white">{status}</p>}
          </div>
        </div>
      )}
    </>
  );
}
