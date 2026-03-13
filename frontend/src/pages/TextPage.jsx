import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FileText, Send, Loader2, Trash2 } from "lucide-react";

export default function TextPage() {
  const [texts, setTexts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchTexts = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/texts`);
      if (res.data.success) {
        setTexts(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load texts.");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/texts`, {
        content: content.trim(),
      });
      if (res.data.success) {
        toast.success("Text saved!");
        setContent("");
        // Prepend the new text to the list
        setTexts([res.data.data, ...texts]);
      }
    } catch (error) {
      toast.error("Failed to save text.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/texts/${id}`);
      if (res.data.success) {
        toast.success("Notice deleted!");
        setTexts(texts.filter(text => text._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete notice.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <div className="bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20">
          <FileText className="text-blue-500 w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-black tracking-tight">Notices</h1>
      </div>

      <div className="bg-[#131720] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/50 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300">Add New Notice</h2>
        </div>
        <div className="p-4 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something interesting..."
            className="w-full h-40 bg-[#0b0e14] border border-gray-800 rounded-lg p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none shadow-inner"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "Saving..." : "Save Text"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black-200 border-b border-gray-800 pb-2">Saved Notices</h2>
        {fetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : texts.length === 0 ? (
          <div className="text-center py-12 bg-[#131720] border border-gray-800 rounded-xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No texts saved yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {texts.map((text) => (
              <div 
                key={text._id} 
                className="bg-[#131720] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors shadow-md group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="whitespace-pre-wrap text-gray-300 leading-relaxed text-[15px] max-h-96 overflow-y-auto custom-scrollbar">
                  {text.content}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-800/50 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono bg-gray-900 px-2 py-0.5 rounded">ID: {text._id.slice(-6)}</span>
                    <span>{new Date(text.createdAt).toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(text._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
