import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ fontFamily: "sans-serif" }}>

      {/* 🔹 HERO SECTION */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "#fff",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
            MediaStack
          </h1>

          <p style={{ fontSize: "1.2rem", marginBottom: "30px", opacity: 0.9 }}>
            Upload, manage and stream your videos securely with real-time
            progress and cloud storage.
          </p>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <Link to="/upload">
              <button style={primaryBtn}>Upload Video</button>
            </Link>

            <Link to="/myvideos">
              <button style={secondaryBtn}>My Videos</button>
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 FEATURES */}
      <section style={{ padding: "60px 20px", background: "#f9f9f9" }}>
        <h2 style={sectionTitle}>Why MediaStack?</h2>

        <div style={grid}>
          <Feature
            title="Cloud Storage"
            desc="Videos are securely stored and streamed from Cloudinary."
          />
          <Feature
            title="Real-time Upload"
            desc="Live upload progress using Socket.io."
          />
          <Feature
            title="Private Dashboard"
            desc="View and manage only your uploaded videos."
          />
          <Feature
            title="Fast & Secure"
            desc="JWT authentication and protected routes."
          />
        </div>
      </section>

      {/* 🔹 HOW IT WORKS */}
      <section style={{ padding: "60px 20px" }}>
        <h2 style={sectionTitle}>How It Works</h2>

        <div style={grid}>
          <Step number="1" text="Login to your account" />
          <Step number="2" text="Upload a video" />
          <Step number="3" text="Stream & manage your content" />
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer
        style={{
          background: "#111",
          color: "#aaa",
          textAlign: "center",
          padding: "20px",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} MediaStack · Built with MERN
      </footer>
    </div>
  );
};

export default Home;

/* 🔹 COMPONENTS */

const Feature = ({ title, desc }) => (
  <div style={card}>
    <h3>{title}</h3>
    <p style={{ opacity: 0.8 }}>{desc}</p>
  </div>
);

const Step = ({ number, text }) => (
  <div style={card}>
    <h1 style={{ fontSize: "2.5rem", color: "#2c5364" }}>{number}</h1>
    <p>{text}</p>
  </div>
);

/* 🔹 STYLES */

const sectionTitle = {
  textAlign: "center",
  marginBottom: "40px",
  fontSize: "2rem",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  maxWidth: "1000px",
  margin: "0 auto",
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

const primaryBtn = {
  padding: "12px 24px",
  fontSize: "1rem",
  background: "#00c6ff",
  color: "#000",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "12px 24px",
  fontSize: "1rem",
  background: "transparent",
  color: "#fff",
  border: "2px solid #fff",
  borderRadius: "25px",
  cursor: "pointer",
};
