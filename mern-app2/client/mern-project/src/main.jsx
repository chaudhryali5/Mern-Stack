import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';  // Import Toaster
import './index.css';
import Routes from './routes/Routes.jsx';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  <>
  <div className="min-h-screen w-full relative bg-black">
    {/* Violet Storm Background with Top Glow */}
    <div
      className="absolute inset-0 z-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
      }}
    />
  
    {/* Your Content/Components */}
    <Toaster />   {/* Toast container — must be present for toast messages */}
    <Routes />
  </div>
    

  </>
);

