/**
 * The very first page for sign up.
 * Includes animation effects for smooth transitions.
 * This page takes only user's name.
 * User name is an non-empty string.
 * 
 * TODO:
 *
 * Connect with DB
 * Figure out correct button sizes
 */

import { motion } from "framer-motion";
import { useState } from "react";

export default function SignUpName() {
  const [username, setUserName] = useState("");

  // Handle submit (Next button)
  const handleSubmit = async (e: React.FormEvent) => {

    // Prevent reloading
    e.preventDefault();

    const formData = { username }; 
    const jsonData = JSON.stringify(formData);
    console.log(jsonData);

    try {
      const response = await fetch(import.meta.env.VITE_SERVER_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
      });

      const upload_response = await response.json();

      if (upload_response.success === true) {
        console.log("User name saved successfully");
        window.location.replace(import.meta.env.VITE_REDIRECT_URL);
      } else {
        console.log("Error while setting username");
        alert("Please enter your name");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Network error");
    }
  };

  const handlePrevious = () => {
    // Go back in browser history ( so far )
    window.history.back();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <img
        src="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
        alt=""
        className="pointer-events-none select-none absolute -bottom-8 -left-8 w-[65vw] max-w-sm object-cover opacity-90"
      />

      {/* Question text */}
      <motion.h1
        initial={{ y: 0, scale: 1, opacity: 1 }}
        animate={{ y: "-32vh", scale: 0.88, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, mass: 0.8 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 text-6xl font-extrabold tracking-tight"
      >
        What's <br />
        Your <br />
        Name? <br />
      </motion.h1>

      {/* Input + Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 flex w-64 flex-col items-center gap-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="sr-only">UserName</span>
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 mb-2 outline-none ring-0 focus:border-blue-500"
              autoComplete="username"
              name="name"
              required
            />
          </label>

          {/* Buttons Row */}
          <div className="mt-4 flex justify-between items-center">
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrevious}
              className="rounded-full border border-gray-400 px-5 py-3 text-center font-small text-gray-700 hover:bg-gray-100 active:translate-y-[1px]"
            >
              ← Previous
            </button>

            {/* Next Button */}
            <button
              type="submit"
              className="rounded-full bg-gray-900 px-5 py-3 text-center font-small text-white shadow hover:bg-gray-800 active:translate-y-[1px]"
            >
              Next →
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
