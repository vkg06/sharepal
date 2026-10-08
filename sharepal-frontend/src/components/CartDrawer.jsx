import { useMemo } from "react";

import { useCart } from "../context/CartContext.jsx";

const formatRupees = (value) =>
  "₹" +
  Number(value || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 0
    }
  );

export default function CartDrawer({
  open,
  onClose,
  rentalDays,
  onCheckout
}) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const rentalTotal = useMemo(
    () =>
      cart.perDaySubtotal *
      Math.max(1, rentalDays || 1),
    [
      cart.perDaySubtotal,
      rentalDays
    ]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="cart-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <aside
        className="cart-drawer"
        aria-label="Shopping cart"
      >
        <div className="cart-drawer__header">
          <div>
            <h2>Your Cart</h2>

            <p>
              {cart.itemCount}{" "}
              {cart.itemCount === 1
                ? "item"
                : "items"}
            </p>
          </div>

          <button
            type="button"
            className="cart-drawer__close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">
              🛒
            </div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add gaming gadgets to
              your cart to continue.
            </p>

            <button
              type="button"
              className="btn btn--primary"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map(
                (item) => (
                  <div
                    className="cart-item"
                    key={item.productId}
                  >
                    <div className="cart-item__image">
                      <img
                        src={
                          item.product.image
                        }
                        alt={
                          item.product.name
                        }
                      />
                    </div>

                    <div className="cart-item__body">
                      <h3>
                        {item.product.name}
                      </h3>

                      <p className="cart-item__price">
                        {formatRupees(
                          item.product
                            .per_day_rent
                        )}
                        /day
                      </p>

                      <div className="cart-item__bottom">
                        <div className="cart-qty">
                          <button
                            type="button"
                            disabled={
                              item.quantity <=
                              1
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity -
                                  1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={
                              item.quantity >=
                              10
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity +
                                  1
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-item__remove"
                          onClick={() =>
                            removeFromCart(
                              item.productId
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="cart-drawer__footer">
              <button
                type="button"
                className="cart-clear"
                onClick={clearCart}
              >
                Clear cart
              </button>

              <div className="cart-summary">
                <div>
                  <span>
                    Per day
                  </span>

                  <strong>
                    {formatRupees(
                      cart.perDaySubtotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    {rentalDays > 0
                      ? `${rentalDays} ${
                          rentalDays === 1
                            ? "day"
                            : "days"
                        }`
                      : "Estimated total"}
                  </span>

                  <strong>
                    {formatRupees(
                      rentalTotal
                    )}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="btn btn--primary cart-checkout"
                onClick={onCheckout}
              >
                Continue to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}