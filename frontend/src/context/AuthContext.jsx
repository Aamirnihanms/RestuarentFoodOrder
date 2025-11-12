import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   const token = localStorage.getItem("token");

  //   if (storedUser && token) {
  //     setUser(JSON.parse(storedUser));
  //   }

  //   setLoading(false);
  // }, []);

  const register = async (name, email, password) => {
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
      toast.success("Registration successful!");
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

const login = async (email, password) => {
  try {
    const data = await loginUser(email, password);
    

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    setUser(data.user);

    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
      toast.success("Login successful!");
    }

  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
