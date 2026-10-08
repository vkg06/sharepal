const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

function getClientId() {
  const key = "sharepal-client-id";

  let id = localStorage.getItem(key);

  if (!id) {
    id =
      typeof crypto !== "undefined" &&
        crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(key, id);
  }

  return id;
}

function getToken() {
  return localStorage.getItem("sharepal-auth-token");
}

export function saveToken(token) {
  localStorage.setItem(
    "sharepal-auth-token",
    token
  );
}

export function removeToken() {
  localStorage.removeItem(
    "sharepal-auth-token"
  );
}

export function isLoggedIn() {
  return Boolean(getToken());
}

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        "x-client-id": getClientId(),

        ...(token
          ? {
            Authorization: `Bearer ${token}`
          }
          : {}),

        ...(options.headers || {})
      }
    }
  );

  const body = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body.message || "Request failed"
    );
  }

  return body;
}

export const api = {
  getProducts: () =>
    request("/products"),

  getContent: () =>
    request("/content"),

  getWishlist: () =>
    request("/interactions/wishlist"),

  toggleWishlist: (id) =>
    request(
      `/interactions/wishlist/${id}/toggle`,
      {
        method: "POST"
      }
    ),

  notify: (id) =>
    request(
      `/interactions/products/${id}/notify`,
      {
        method: "POST"
      }
    ),

  vote: (id) =>
    request(
      `/interactions/products/${id}/vote`,
      {
        method: "POST"
      }
    ),

  quote: (id, params) =>
    request(
      `/interactions/products/${id}/quote?${new URLSearchParams(params)}`
    ),

  availability: (id, params) =>
    request(
      `/interactions/products/${id}/availability?${new URLSearchParams(params)}`
    ),

  rent: (id, payload) =>
    request(
      `/interactions/products/${id}/rent`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    ),

  sendOtp: (phone) =>
    request(
      "/auth/send-otp",
      {
        method: "POST",
        body: JSON.stringify({ phone })
      }
    ),

  verifyOtp: (phone, otp) =>
    request(
      "/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({
          phone,
          otp
        })
      }
    ),

  me: () =>
    request("/auth/me"),
  getCart: () =>
    request("/cart"),

  addToCart: (productId, quantity = 1) =>
    request(
      `/cart/items/${productId}`,
      {
        method: "POST",
        body: JSON.stringify({
          quantity
        })
      }
    ),

  updateCartItem: (
    productId,
    quantity
  ) =>
    request(
      `/cart/items/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          quantity
        })
      }
    ),

  removeFromCart: (productId) =>
    request(
      `/cart/items/${productId}`,
      {
        method: "DELETE"
      }
    ),

  clearCart: () =>
    request("/cart", {
      method: "DELETE"
    }),


};