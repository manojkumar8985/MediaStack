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

  const [videoCount, setVideoCount] = useState(null); // null for "loading"

  useEffect(() => {
    const fetchVideoCount = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9000/api/videos/count",
          { withCredentials: true }
        );
        setVideoCount(res.data.count);
      } catch (err) {
        console.error(err);
        setVideoCount(0); // fallback if API fails
      }
    };
    fetchVideoCount();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:9000/auth/logout",
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

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", background: "#fff", borderRadius: "16px", padding: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src="https://www.gravatar.com/avatar/?d=mp&f=y"
              alt="profile"
              style={{ width: "108px", height: "108px", borderRadius: "50%", border: "4px solid white" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "28px" }}>{data.userName}</h1>
            <p style={{ color: "#777", fontSize: "14px" }}>
              Passionate about building scalable apps and smooth video experiences 🚀
            </p>

            <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
              <button style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#000", color: "#fff", cursor: "pointer" }}>Edit Profile</button>
              <button onClick={handleLogout} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Logout</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginTop: "30px" }}>
          <Stat label="Videos" value={videoCount !== null ? videoCount : "…"} />
          <Stat label="Total Views" value={data.views || 0} />
          <Stat label="Uploads" value={videoCount !== null ? videoCount : "…"} />
        </div>

        {/* Details */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ marginBottom: "12px" }}>Profile Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <Detail label="Email" value={data.email} />
            <Detail label="Location" value="India" />
            <Detail label="Account Status" value="Active" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div style={{ padding: "20px", borderRadius: "12px", background: "#f9fafb", textAlign: "center" }}>
    <h2 style={{ margin: 0 }}>{value}</h2>
    <p style={{ margin: "6px 0", color: "#666" }}>{label}</p>
  </div>
);

const Detail = ({ label, value }) => (
  <div style={{ padding: "16px", borderRadius: "10px", background: "#f9fafb" }}>
    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>{label}</p>
    <h4 style={{ margin: "6px 0 0 0" }}>{value}</h4>
  </div>
);

export default ProfilePage;
