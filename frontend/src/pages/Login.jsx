import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const features = [
  {
    title: "Shockingly affordable 💸",
    desc: "Powerful travel tools at a budget-friendly price.",
    color: "from-pink-400 to-pink-600",
  },
  {
    title: "Blazing fast ⚡",
    desc: "Optimized performance with instant responses.",
    color: "from-green-400 to-green-600",
  },
  {
    title: "Beautiful video 🎬",
    desc: "Immersive video experiences with smooth playback.",
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Built for developers 👨‍💻",
    desc: "Clean architecture & scalable components.",
    color: "from-yellow-400 to-yellow-600",
  },
];

export default function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    password: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [problem, setProblem] = useState("");

  const change = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setProblem("");
  };


  const control = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!userInfo.fullName || !userInfo.password) {
      setProblem("All fields are required");
      return;
    }

    if (!acceptedTerms) {
      setProblem("You must accept the terms and conditions");
      return;
    }

    try {
      await axios.post(
        "https://mediastack-1.onrender.com/auth/login",
        {
          userName: userInfo.fullName,
          password: userInfo.password,
        },
        { withCredentials: true }
      );

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      setProblem(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdf7ef] flex items-center justify-center px-4">
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30"
      />

      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT FEATURES */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className={`h-1 w-14 mb-4 rounded-full bg-gradient-to-r ${item.color}`} />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto"
        >
          <h2 className="text-3xl font-bold text-center">MediaStack 🎥</h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            Capture moments. Share journeys.
          </p>

          {problem && (
            <div className="mb-4 bg-red-600 text-white p-4 rounded text-center">
              {problem}
            </div>
          )}

          <form className="space-y-5" onSubmit={control}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                name="fullName"
                onChange={change}
                value={userInfo.fullName}
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                onChange={change}
                value={userInfo.password}
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="accent-green-400"
              />
              <span>
                I agree to the{" "}
                <span className="text-green-400 cursor-pointer">
                  terms of service
                </span>{" "}
                and{" "}
                <span className="text-green-400 cursor-pointer">
                  privacy policy
                </span>
              </span>
            </div>

            {/* BUTTON */}
            <motion.button
              disabled={!acceptedTerms}
              whileHover={{ scale: acceptedTerms ? 1.05 : 1 }}
              whileTap={{ scale: acceptedTerms ? 0.95 : 1 }}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg
                ${
                  acceptedTerms
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              Start Recording 🚀
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-medium hover:underline">
              Signup
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
