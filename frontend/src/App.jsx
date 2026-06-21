import React from 'react'
import {Route, Routes} from 'react-router'
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import {useAuthStore} from './store/useAuthStore.js';

function App() {
  const {authUser, isLoading} = useAuthStore();

  console.log("Auth User:", authUser);
  console.log("Is Loading:", isLoading);

  return (
    <div className="min-h-screen bg-[#0B1F17] relative flex items-center justify-center p-4 overflow-hidden text-white">

  {/* Grid */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

  {/* Top glow */}
  <div className="absolute top-0 -left-4 size-96 bg-green-500 opacity-20 blur-[100px]" />

  {/* Bottom glow */}
  <div className="absolute bottom-0 -right-4 size-96 bg-emerald-200 opacity-20 blur-[100px]" />

    <Routes>
      <Route path="/" element={<ChatPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignUpPage/>} />
    </Routes>
    </div>
  );
}

export default App
