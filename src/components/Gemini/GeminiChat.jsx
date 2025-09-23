// GeminiChat.jsx
import { useState } from "react";

const GeminiChat = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.text || "No response from AI");
        } catch (err) {
            console.error(err);
            setResponse("Error: Unable to get response");
        }
        setLoading(false);
    };

    const handleClear = () => {
        setPrompt("");
        setResponse("");
    };

    return (
        <div className="flex flex-col gap-3 text-black"> {/* make all text black */}
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your question here..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-28 text-black"
            />

            <div className="flex gap-3">
                <button
                    onClick={handleSend}
                    className="bg-purple-500 hover:bg-purple-600 text-black font-semibold px-6 py-2 rounded-lg transition"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send"}
                </button>

                <button
                    onClick={handleClear}
                    className="bg-red-500 hover:bg-red-600 text-black font-semibold px-6 py-2 rounded-lg transition"
                >
                    Clear History
                </button>
            </div>

            {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg border-l-4 border-purple-500 text-black whitespace-pre-wrap">
                    {response}
                </div>
            )}
        </div>
    );
};

export default GeminiChat;
