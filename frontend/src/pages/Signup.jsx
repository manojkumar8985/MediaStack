import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Navigate } from "react-router-dom";
// const features = [
//   {
//     title: "Shockingly affordable 💸",
//     desc: "Powerful travel tools at a budget-friendly price.",
//     color: "from-pink-400 to-pink-600",
//   },
//   {
//     title: "Blazing fast ⚡",
//     desc: "Optimized performance with instant responses.",
//     color: "from-green-400 to-green-600",
//   },
//   {
//     title: "Beautiful video 🎬",
//     desc: "Immersive video experiences with smooth playback.",
//     color: "from-blue-400 to-blue-600",
//   },
//   {
//     title: "Built for developers 👨‍💻",
//     desc: "Clean architecture & scalable components.",
//     color: "from-yellow-400 to-yellow-600",
//   },
// ];

export default function Signup() {
  const queryClient = useQueryClient();

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    repassword: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [problem, setProblem] = useState("");


  const change = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setProblem("");
  };


  const control = async (e) => {
    e.preventDefault();

    // 🔒 VALIDATIONS
    if (!userInfo.fullName || !userInfo.email || !userInfo.password || !userInfo.repassword) {
      setProblem("All fields are required");
      return;
    }

    if (userInfo.password.length < 6) {
      setProblem("Password must be at least 6 characters long");
      return;
    }

    if (userInfo.password !== userInfo.repassword) {
      setProblem("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setProblem("You must accept the terms and conditions");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        {
          userName: userInfo.fullName,
          email: userInfo.email,
          password: userInfo.password,
        },
        { withCredentials: true }
      );

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      Navigate("/");
      toast.success("Signup successful 🎉");
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

      <div className="absolute top-8 w-full flex justify-center z-50">
        <Link to="/">
          <img src="/logo.png" alt="MediaStack" className="h-16 w-auto" />
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT FEATURES */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {/* {features.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className={`h-1 w-14 mb-4 rounded-full bg-gradient-to-r ${item.color}`} />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
            </motion.div>
          ))} */}
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto"
        >


          {problem && (
            <div className="mb-4 bg-red-600 text-white p-4 rounded text-center">
              {problem}
            </div>
          )}

          <form className="space-y-5" onSubmit={control}>
            {["fullName", "email", "password", "repassword"].map((field, i) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === "fullName"
                    ? "Username"
                    : field === "repassword"
                      ? "Re-enter Password"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <motion.input
                  name={field}
                  type={field.includes("password") ? "password" : field}
                  onChange={change}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}

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
                <span className="text-green-400 cursor-pointer">terms of service</span> and{" "}
                <span className="text-green-400 cursor-pointer">privacy policy</span>
              </span>
            </div>

            {/* BUTTON */}
            <motion.button
              disabled={!acceptedTerms}
              whileHover={{ scale: acceptedTerms ? 1.05 : 1 }}
              whileTap={{ scale: acceptedTerms ? 0.95 : 1 }}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg
                ${acceptedTerms
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Start Recording 🚀
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-medium hover:underline">
              Login
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200"
            >
              <span className="text-xl">🎬</span>
              View Public Timeline
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
