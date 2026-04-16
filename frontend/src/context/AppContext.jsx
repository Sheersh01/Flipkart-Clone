import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthUser,
  getCart,
  getCartCountSnapshot,
  getAuthUser,
  loginUser,
  logoutUser,
  registerUser,
  setAuthSession,
  subscribeAuthState,
  subscribeCartCount,
} from "../lib/apiClient";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [cartCount, setCartCount] = useState(() => getCartCountSnapshot());

  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState(({ user }) => {
      setAuthUser(user);
      if (!user) {
        setCartCount(0);
      }
    });

    const unsubscribeCart = subscribeCartCount(setCartCount);

    return () => {
      unsubscribeAuth();
      unsubscribeCart();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function refreshCartCount() {
      if (!authUser) {
        return;
      }

      try {
        await getCart();
      } catch {
        if (isMounted) {
          setCartCount(0);
        }
      }
    }

    refreshCartCount();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const authActions = useMemo(
    () => ({
      async login(payload) {
        const data = await loginUser(payload);
        setAuthSession(data.user, data.token);
        return data;
      },
      async register(payload) {
        const data = await registerUser(payload);
        setAuthSession(data.user, data.token);
        return data;
      },
      async logout() {
        try {
          await logoutUser();
        } finally {
          clearAuthUser();
          setCartCount(0);
        }
      },
    }),
    [],
  );

  const value = useMemo(
    () => ({
      authUser,
      isAuthenticated: Boolean(authUser),
      cartCount,
      ...authActions,
    }),
    [authUser, cartCount, authActions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
