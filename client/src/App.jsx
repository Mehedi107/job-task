import { useState, useEffect, useContext } from 'react';
import './App.css';
import LoginModal from './components/modal/LoginModal';
import RegisterModal from './components/modal/RegisterModal';
import defaultUserIcon from './assets/user.svg'; // Add a default user icon
import AuthContext from './context/AuthContext';

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const { user, signOutUser } = useContext(AuthContext);

  // Apply theme on load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Manager
          </h1>

          <div className="flex gap-4 items-center">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-full transition duration-200 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>

            {user ? (
              // If user is logged in, show profile picture & logout button
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || defaultUserIcon}
                  alt="User"
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
                />
                <button
                  onClick={signOutUser}
                  className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              // If user is NOT logged in, show Sign In button
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer hover:bg-blue-600"
                onClick={() => setIsSignInModalOpen(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['To-Do', 'In Progress', 'Done'].map(category => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h2>
              <div className="min-h-[150px] border border-dashed border-gray-300 dark:border-gray-600 p-2 rounded-lg">
                {/* Task Cards (Will be draggable later) */}
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <button className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg">
          + Add Task
        </button>

        {/* Sign In Modal */}
        <LoginModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
        />
        {/* Register Modal */}
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setIsSignInModalOpen(true);
          }}
        />
      </div>
    </>
  );
}

export default App;
