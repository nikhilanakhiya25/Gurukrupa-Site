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
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN (ONLY FOR AUTH)
  const login = (userData, tokenData) => {
    if (!userData || !tokenData) return;

    const normalizedUser = {
      ...userData,
      role: userData.role?.toLowerCase() || "user",
    };

    setUser(normalizedUser);
    setToken(tokenData);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", tokenData);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // 🛠 SAFE PROFILE UPDATE (username, avatar, etc.)
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = {
        ...prev,
        ...updates
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
