import React from 'react';
import ReactDOM from 'react-dom/client';
import LedgerUpload from './components/LedgerUpload'; // Import the component
import './index.css'; // Import your Tailwind styles

// This is the root layout of your application
function AppLayout() {
  return (
    <div data-theme="cupcake" className="bg-base-200 min-h-screen flex items-center justify-center p-4">
      <LedgerUpload />
    </div>
  );
}

// Render the AppLayout component to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppLayout />
  </React.StrictMode>,
);

export default AppLayout;