import { useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './../../context/AuthContext';
import googleIcon from './../../assets/google.png';
import axios from 'axios';

const BtnGoogleLogin = ({ onClose }) => {
  const { googleLogin } = useContext(AuthContext);

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();
      const userData = {
        name: res.user.displayName,
        email: res.user.email,
        photo: res.user.photoURL,
      };

      // Save user data to database
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users`,
        userData
      );

      // Close the modal after successful login
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200 cursor-pointer"
      onClick={handleGoogleLogin}
    >
      <span>
        <img src={googleIcon} alt="google" className="w-5 h-5" />
      </span>
      Continue with Google
    </button>
  );
};

BtnGoogleLogin.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BtnGoogleLogin;
