import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { api } from "../api/client.js";

import { useAuth } from "./AuthContext.jsx";

const CartContext =
  createContext(null);

export function CartProvider({
  children
}) {
  const {
    isAuthenticated,
    loading: authLoading
  } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    perDaySubtotal: 0
  });

  const [loading, setLoading] =
    useState(false);

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        itemCount: 0,
        perDaySubtotal: 0
      });

      return;
    }

    setLoading(true);

    try {
      const result =
        await api.getCart();

      setCart(result);
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [
    isAuthenticated,
    authLoading
  ]);

  const addToCart = async (
    productId,
    quantity = 1
  ) => {
    const result =
      await api.addToCart(
        productId,
        quantity
      );

    setCart(result);

    return result;
  };

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    const result =
      await api.updateCartItem(
        productId,
        quantity
      );

    setCart(result);

    return result;
  };

  const removeFromCart = async (
    productId
  ) => {
    const result =
      await api.removeFromCart(
        productId
      );

    setCart(result);

    return result;
  };

  const clearCart = async () => {
    const result =
      await api.clearCart();

    setCart(result);

    return result;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        reloadCart: loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}