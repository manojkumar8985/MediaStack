import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadVideo from "./pages/Uploadvideo";
import { Toaster } from "react-hot-toast";
import userAuth from "./hooks/useAuthUser";
import DashboardLayout from "./Dashboard";
import MyVideos from "./pages/MyVideos";
import ProfilePage from "./pages/Profile";

function App() {
  const { user, isLoading } = userAuth();
  console.log(user);




  return (
    <>

     <Routes>


  {!user && (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />


      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )}


  {user!==null && (
    <>
      <Route
        path="/"
        element={
          <DashboardLayout>
            
            <Home />
          </DashboardLayout>
        }
      />

      <Route
        path="/home"
        element={
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        }
      />

      <Route
        path="/upload"
        element={
          <DashboardLayout>
            <UploadVideo />
          </DashboardLayout>
        }
      />

      <Route
        path="/myvideos"
        element={
          <DashboardLayout>
            <MyVideos />
          </DashboardLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        }
      />

      {/* redirect login/signup if already logged in */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )}

</Routes>

      <Toaster position="top-center" />
    </>
  );
}

export default App;
