import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';

// This component checks if the user is on a mobile device
// If they are, it shows the normal dashboard layout
// If not, it shows a message telling them to use a mobile device

const MobileOnlyLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // State to track if the device is mobile
  const [isMobile, setIsMobile] = useState(false);
  // State to track if we've checked the device size
  const [hasChecked, setHasChecked] = useState(false);

  // Check the screen size when the component loads
  useEffect(() => {
    // Function to check if the screen is mobile-sized
    const checkIfMobile = () => {
      // Consider mobile if width is less than 768px (typical tablet breakpoint)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setHasChecked(true);
    };

    // Check immediately
    checkIfMobile();

    // Also check if the window is resized
    window.addEventListener('resize', checkIfMobile);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // If we haven't checked yet, don't render anything
  // This prevents flashing of content
  if (!hasChecked) {
    return null;
  }

  // If it's a mobile device, show the normal layout
  if (isMobile) {
    return <DashboardLayout children={children} />;
  }

  // If it's not a mobile device, show a message
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Mobile Only View
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This section of the application is designed for mobile devices only. 
          Please access it from your smartphone or resize your browser window to a mobile size.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Current screen width: {window.innerWidth}px
          <br />
          Required width: Less than 768px
        </div>
      </div>
    </div>
  );
};

export default MobileOnlyLayout;
