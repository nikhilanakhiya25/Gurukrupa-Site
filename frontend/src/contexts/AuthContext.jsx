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
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN (ONLY FOR AUTH)
  const login = (userData, tokenData) => {
    if (!userData || !tokenData) return;

    setUser(userData);
    setToken(tokenData);

    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
