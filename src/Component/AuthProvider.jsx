import { useState, useEffect } from "react";
import AuthContext from "../../AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../Firebase";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const handleLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("userRole", "user");
      alert(`Logged in as ${result.user.displayName}`);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        const userData = { email: currentUser.email };
        axios.post("https://backend-nu-livid-37.vercel.app/jwt", userData)
          .then((res) => {
            const token = res.data.token;
            localStorage.setItem("token", token);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userRole");
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const authInfo = {
    user,
    setUser,
    logout,
    createUser,
    handleGoogleLogin,
    handleLogin,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
