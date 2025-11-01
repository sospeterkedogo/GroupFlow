'use client';
import { useState } from 'react';

export default function DemoButton() {
  const [loading, setLoading] = useState(false);

  const handleDemoClick = () => {
    setLoading(true);

    // Redirect user to the main app demo page
    window.location.href = 'https://groupflow-livid.vercel.app/demo';
  };

  return (
    <button
      onClick={handleDemoClick}
      disabled={loading}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
    >
      {loading ? 'Redirecting...' : 'Try Demo'}
    </button>
  );
}
