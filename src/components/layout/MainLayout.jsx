import LeftSidebar from './LeftSidebar';
import CenterPanel from './CenterPanel';
import RightSidebar from './RightSidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import VerifyConnection from '../VerifyConnection';

const MainLayout = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8000/auth/verification-status',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (!res.data.isVerified) {
          setIsVerified(false);
          setShowVerifyModal(true);
        }
      } catch (err) {
        console.error("Verification check failed", err);
      }
    };

    if (accessToken) {
      checkVerification();
    }
  }, [accessToken]);

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get(
        "http://localhost:8000/google/connect",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.auth_url)
      window.location.href = response.data.auth_url;
  
    } catch (err) {
      console.error("Verification failed", err);
      alert("Failed to start verification");
    }
  };

  return (
    <>
    <div className="flex max-h-screen">
      <aside className="hidden md:flex w-80 border-r border-slate-200 bg-white/80 backdrop-blur-sm overflow-y-auto">
        <LeftSidebar />
      </aside>

      <main className="flex-1 flex overflow-y-auto ">
        <CenterPanel />
      </main>

      <aside className="hidden lg:flex w-80 border-l border-slate-200 bg-white/80 backdrop-blur-sm overflow-y-auto">
        <RightSidebar />
      </aside>
    </div>
    </>
  );
};

export default MainLayout;
