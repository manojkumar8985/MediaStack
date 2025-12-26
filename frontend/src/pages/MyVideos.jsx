import { useEffect, useState } from "react";
import axios from "axios";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenVideos, setBrokenVideos] = useState({});
  const [sortBy, setSortBy] = useState("latest");
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9000/api/videos/myvideos",
          { withCredentials: true }
        );
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "az") return a.title.localeCompare(b.title);
    if (sortBy === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading videos…</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "15px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>🎬 My Videos</h2>

        {videos.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A – Z</option>
            <option value="za">Z – A</option>
          </select>
        )}
      </div>

      {/* EMPTY STATE */}
      {videos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "#fafafa",
            borderRadius: "16px",
            border: "1px dashed #ddd",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "10px" }}>📂</div>
          <h3 style={{ marginBottom: "6px" }}>No videos yet</h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            You haven’t uploaded any videos. Start by uploading your first one.
          </p>

          <a
            href="/upload"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Upload Video 🎥
          </a>
        </div>
      )}

      {/* GRID */}
      {videos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {sortedVideos.map((video) => (
            <div
              key={video._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "12px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
              }}
            >
              {/* GREEN SAFE DOT */}
              {!brokenVideos[video._id] && (
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 4px rgba(16,185,129,0.6)",
                  }}
                  title="Safe Video"
                />
              )}

              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {video.title}
              </h4>

              {video.status === "processing" && (
                <p style={{ color: "#f59e0b", fontWeight: 500 }}>⏳ Processing…</p>
              )}

              {video.status !== "processing" && brokenVideos[video._id] && (
                <p style={{ color: "red", fontWeight: 500 }}>❌ Video unavailable</p>
              )}

              {video.status !== "processing" && !brokenVideos[video._id] && (
                <video
                  controls
                  preload="metadata"
                  onClick={() => setActiveVideo(video)}
                  onError={() =>
                    setBrokenVideos((prev) => ({
                      ...prev,
                      [video._id]: true,
                    }))
                  }
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginTop: "10px",
                    border: "2px solid #e5e7eb",
                    transition: "border 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "2px solid #6366f1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "2px solid #e5e7eb";
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
              )}

              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#666",
                  fontWeight: 500,
                }}
              >
                Status: {video.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ZOOM MODAL */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "900px",
            }}
          >
            <button
              onClick={() => setActiveVideo(null)}
              style={{
                position: "absolute",
                top: "-45px",
                right: "0",
                fontSize: "30px",
                background: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <video
              src={activeVideo.videoUrl}
              controls
              autoPlay
              style={{
                width: "100%",
                maxHeight: "80vh",
                borderRadius: "12px",
                background: "#000",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVideos;
