import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../context/AuthContext';
import { app } from './../firebase/firebase.config';

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  const createUser = async (email, password, displayName, photoURL) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with displayName and photoURL
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => signOut(auth);

  const googleLogin = async () => signInWithPopup(auth, provider);

  // Show Logged in user
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        createUser,
        signInUser,
        signOutUser,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
