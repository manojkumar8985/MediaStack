import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PublicTexts() {
    const [texts, setTexts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // To track when we started showing the current text
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                // Reusing the same endpoint, assuming it doesn't strictly require auth for read
                // Alternatively, an explicit /api/texts/public could be created if needed
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/texts`);
                if (res.data.success) {
                    setTexts(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch public texts", err);
            }
        };
        fetchTexts();
    }, []);

    const goToNext = () => {
        if (texts.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % texts.length);
    };

    useEffect(() => {
        if (texts.length === 0) return;

        // Auto-advance texts every 5 seconds
        timerRef.current = setTimeout(() => {
            goToNext();
        }, 5000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentIndex, texts]);

    if (texts.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <p>Loading notices...</p>
                <Link to="/login" className="mt-4 text-blue-400 underline">Back to Login</Link>
            </div>
        );
    }

    const currentText = texts[currentIndex];

    return (
         <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden flex flex-col items-center justify-center">
            {/* Header */}
            <div className="absolute top-0 w-full z-10 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
                <Link to="/">
                    <img src="/logo.png" alt="MediaStack" className="h-8 w-auto" />
                </Link>
                <Link
                    to="/login"
                    className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    Back to Login
                </Link>
            </div>

            {/* Main Content Display */}
            <div className="w-full h-full flex items-center justify-center p-8 max-w-5xl mx-auto">
                 <div
                    key={currentText._id || currentIndex}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl animate-fadeIn flex flex-col items-center  space-y-8"
                >
                    <div className="text-blue-400 font-mono text-sm tracking-widest uppercase opacity-80">
                         Notice {currentIndex + 1} of {texts.length}
                    </div>
                    <p className={`text-white font-light leading-relaxed md:leading-normal whitespace-pre-wrap selection:bg-blue-500/30 ${currentText.content.length > 200 ? 'text-sm md:text-base lg:text-lg' : 'text-base md:text-xl lg:text-2xl'}`}>
                        {currentText.content}
                    </p>
                    <div className="text-gray-400 text-sm mt-8 opacity-60">
                         {new Date(currentText.createdAt).toLocaleDateString(undefined, {
                             weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                         })}
                    </div>
                </div>
            </div>

            {/* Footer / Info Overlay */}
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="max-w-4xl mx-auto flex justify-between items-end">
                    <div className="flex gap-2 mx-auto">
                        {texts.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS Animation for smooth transitions */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
