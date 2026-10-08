import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  api,
  isLoggedIn,
  removeToken,
  saveToken
} from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!isLoggedIn()) {
        if (active) {
          setLoading(false);
        }

        return;
      }

      try {
        const result = await api.me();

        if (active) {
          setUser(result.user);
        }
      } catch {
        removeToken();

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const sendOtp = async (phone) => {
    return api.sendOtp(phone);
  };

  const verifyOtp = async (phone, otp) => {
    const result = await api.verifyOtp(
      phone,
      otp
    );

    saveToken(result.token);

    setUser(result.user);

    return result.user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        sendOtp,
        verifyOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}