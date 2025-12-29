import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load auth from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("userInfo");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setToken(JSON.parse(savedUser).token);
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN (ONLY FOR AUTH)
  const login = (userData, tokenData) => {
    if (!userData || !tokenData) return;

    const userInfo = {
      ...userData,
      role: userData.isAdmin ? "admin" : "user",
      token: tokenData,
    };

    setUser(userInfo);
    setToken(tokenData);

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userInfo");
  };

  // 🛠 SAFE PROFILE UPDATE (username, avatar, etc.)
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = {
        ...prev,
        ...updates
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      setUser: updateUser, // ✅ SAFE setter
    }}>
    {!loading && children}
    </AuthContext.Provider>
  );
};
