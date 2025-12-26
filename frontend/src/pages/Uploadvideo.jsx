import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import toast from "react-hot-toast";
const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  // listen for socket progress
  useEffect(() => {
    socket.on("upload-progress", (data) => {
      setProgress(data.percent);
    });

    return () => socket.off("upload-progress");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      
      toast.error("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
    formData.append("socketId", socket.id);

    try {
      setLoading(true);
      setProgress(0);
      setMessage("");

      await axios.post(
        "http://localhost:9000/api/videos/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Video uploaded successfully!");
      setVideo(null);
      setPreviewUrl(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "600" }}>
        Getting started with assets
      </h1>

      <p style={{ marginBottom: "20px", color: "#555" }}>
        Upload your first video or audio file
      </p>

{/* Demo buttons */}
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  {["product.mp4", "social.mp4", "background.mp4", "movie.mp4"].map(
    (item) => (
      <button
        key={item}
        type="button"
        style={{
          padding: "10px 14px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          background: "#fff",
          cursor: "pointer",
          flex: "1 1 140px",   // 🔥 responsive magic
          minWidth: "120px",
        }}
      >
        {item}
      </button>
    )
  )}
</div>

      <form onSubmit={handleSubmit}>
        {/* Upload box OR Video preview */}
        {!previewUrl ? (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "220px",
              border: "2px dashed #b6e3f4",
              borderRadius: "8px",
              background: "#dff6ff",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setVideo(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
            <span style={{ fontSize: "16px", fontWeight: "500" }}>
              Upload a local file
            </span>
          </label>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            <video
              src={previewUrl}
              controls
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* Title input */}
        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {/* Progress */}
        {progress > 0 && (
          <p style={{ marginBottom: "10px" }}>
            Upload Progress: {progress}%
          </p>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              background: "#000",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {video && (
  <button
    type="button"
    onClick={() => {
      setVideo(null);
      setPreviewUrl(null);
      setProgress(0);
      setMessage("");
      toast.success("Upload Canceled");
    }}
    style={{
      padding: "10px 18px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      backgroundColor: "#000",
      color: "#fff",
      cursor: "pointer",
      marginLeft: "8px",   // ✅ extra spacing
    }}
  >
    Cancel
  </button>
)}


        </div>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
};

export default UploadVideo;
