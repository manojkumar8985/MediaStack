import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PublicGallery() {
    const [assets, setAssets] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // To track when we started showing the current asset
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/videos/public`);
                setAssets(res.data);
            } catch (err) {
                console.error("Failed to fetch public assets", err);
            }
        };
        fetchAssets();
    }, []);

    const isImage = (url) => {
        if (!url) return false;
        return url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) != null;
    };

    const goToNext = () => {
        if (assets.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % assets.length);
    };

    useEffect(() => {
        if (assets.length === 0) return;

        const currentAsset = assets[currentIndex];

        // Clear any existing timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // If it's an image, auto-advance after 3 seconds
        if (isImage(currentAsset.videoUrl)) {
            timerRef.current = setTimeout(() => {
                goToNext();
            }, 3000);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentIndex, assets]);

    const handleVideoEnded = () => {
        goToNext();
    };

    if (assets.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <p>Loading gallery...</p>
                <Link to="/login" className="mt-4 text-blue-400 underline">Back to Login</Link>
            </div>
        );
    }

    const currentAsset = assets[currentIndex];
    const assetIsImage = isImage(currentAsset.videoUrl);

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col items-center justify-center">
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

            {/* Main Media Display */}
            <div className="w-full h-full flex items-center justify-center">
                {assetIsImage ? (
                    <img
                        key={currentAsset._id || currentIndex}
                        src={currentAsset.videoUrl}
                        alt={currentAsset.title}
                        className="w-full h-full object-contain animate-fadeIn"
                    />
                ) : (
                    <video
                        key={currentAsset._id || currentIndex}
                        src={currentAsset.videoUrl}
                        autoPlay
                        
                        playsInline
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-contain animate-fadeIn"
                    />
                )}
            </div>

            {/* Footer / Info Overlay */}
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="max-w-4xl mx-auto flex justify-between items-end">
                    <div>
                        <h2 className="text-white text-3xl font-bold mb-2 drop-shadow-lg">{currentAsset.title}</h2>
                        <div className="flex gap-2">
                            {assets.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation for smooth transitions */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
