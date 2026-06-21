import React from 'react'
import {Route, Routes, Navigate} from 'react-router'
import { useEffect } from "react";
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import {useAuthStore} from './store/useAuthStore.js';
import PageLoader from './components/PageLoader.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  const {checkAuth, isCheckingAuth, authUser} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#0B1F17] relative flex items-center justify-center p-4 overflow-hidden text-white">

  {/* Grid */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

  {/* Top glow */}
  <div className="absolute top-0 -left-4 size-96 bg-green-500 opacity-20 blur-[100px]" />

  {/* Bottom glow */}
  <div className="absolute bottom-0 -right-4 size-96 bg-emerald-200 opacity-20 blur-[100px]" />

    <Routes>
      <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
    </Routes>

    <Toaster/>
    </div>
  );
}

export default App
