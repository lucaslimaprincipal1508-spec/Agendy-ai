import React from 'react';

export default function Login() {
  const handleGoogleLogin = () => {
    // Pegamos a URL do backend (se estiver na nuvem usa VITE_API_URL, senão usa localhost)
const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Agendy.ai</h1>
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google logo" 
            className="w-5 h-5 bg-white rounded-full p-0.5"
          />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}