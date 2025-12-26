import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAuth from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user: data } = userAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [videoCount, setVideoCount] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchVideoCount = async () => {
      try {
        const res = await axios.get(
          "https://mediastack-1.onrender.com/api/videos/count",
          { withCredentials: true }
        );
        setVideoCount(res.data.count);
      } catch (err) {
        console.error(err);
        setVideoCount(0);
      }
    };
    fetchVideoCount();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://mediastack-1.onrender.com/auth/logout",
        {},
        { withCredentials: true }
      );
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries({ queryKey: ["authUser"] });
      toast.success("Logout successful");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (!data) return <p style={{ textAlign: "center" }}>Loading profile…</p>;

  // adjust sizes for desktop
  const isDesktop = windowWidth > 1024;
  const containerPadding = isDesktop ? "60px" : "20px";
  const containerMinHeight = isDesktop ? "140vh" : "100vh";
  const avatarSize = isDesktop ? 160 : 120;
  const avatarImgSize = isDesktop ? 144 : 108;
  const statsPadding = isDesktop ? "25px" : "15px";

  return (
    <div
      style={{
        minHeight: containerMinHeight,
        padding: `${containerPadding}px 20px`,
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: containerPadding,
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://www.gravatar.com/avatar/?d=mp&f=y"
              alt="profile"
              style={{
                width: avatarImgSize,
                height: avatarImgSize,
                borderRadius: "50%",
                border: "4px solid white",
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <h1 style={{ margin: 0, fontSize: isDesktop ? "36px" : "28px" }}>
              {data.userName}
            </h1>
            <p style={{ color: "#777", fontSize: isDesktop ? "16px" : "14px" }}>
              Passionate about building scalable apps and smooth video experiences 🚀
            </p>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#000",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <Stat label="Videos" value={videoCount !== null ? videoCount : "…"} padding={statsPadding} />
          <Stat label="Total Views" value={data.views || 0} padding={statsPadding} />
          <Stat label="Uploads" value={videoCount !== null ? videoCount : "…"} padding={statsPadding} />
        </div>

        {/* Details */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ marginBottom: "12px", fontSize: isDesktop ? "22px" : "20px" }}>Profile Details</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <Detail label="Email" value={data.email} />
            <Detail label="Location" value="India" />
            <Detail label="Account Status" value="Active" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, padding }) => (
  <div
    style={{
      padding: padding || "15px",
      borderRadius: "12px",
      background: "#f9fafb",
      textAlign: "center",
    }}
  >
    <h2 style={{ margin: 0, fontSize: "clamp(1.2rem, 4vw, 24px)" }}>{value}</h2>
    <p style={{ margin: "6px 0", color: "#666", fontSize: "clamp(0.8rem, 2.5vw, 14px)" }}>
      {label}
    </p>
  </div>
);

const Detail = ({ label, value }) => (
  <div
    style={{
      padding: "16px",
      borderRadius: "10px",
      background: "#f9fafb",
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: "clamp(0.7rem, 2.2vw, 13px)",
        color: "#666",
      }}
    >
      {label}
    </p>
    <h4 style={{ margin: "6px 0 0 0", fontSize: "clamp(0.9rem, 2.5vw, 16px)" }}>{value}</h4>
  </div>
);

export default ProfilePage;
