// TextTest.jsx
import React from "react";
import GeminiChat from "./GeminiChat"; // adjust path if needed

const TextTest = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 flex flex-col items-center justify-start py-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center drop-shadow-lg">
                Welcome to Gemini Chat
            </h1>

            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
                <GeminiChat />
            </div>

            <footer className="mt-10 text-white text-center">
                &copy; 2025 YourAppName. All rights reserved.
            </footer>
        </div>
    );
};

export default TextTest;
