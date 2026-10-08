import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "./icons.jsx";

const CURRENT_TAB = "Gaming";

const shortDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  );

const todayIso = () =>
  new Date().toISOString().slice(0, 10);

function DateChip({
  label,
  value,
  min,
  onChange,
}) {
  const inputRef = useRef(null);

  const openPicker = () =>
    inputRef.current?.showPicker?.();

  return (
    <button
      type="button"
      className="chip"
      onClick={openPicker}
    >
      <CalendarIcon />

      <span>
        {value
          ? shortDate(value)
          : label}
      </span>

      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </button>
  );
}

export default function Header({
  menu,
  city,
  cities,
  onCityChange,

  delivery,
  pickup,
  onDelivery,
  onPickup,
  onApplyDates,

  savedCount,
  onSearchClick,
  onMenuPick,

  // CART
  cartCount,
  onCartClick,

  // AUTH
  user,
  isAuthenticated,
  onLogin,
  onLogout,
  onCategoryClick,
}) {
  const [openTab, setOpenTab] =
    useState(null);

  const navRef = useRef(null);
  const closeTimer = useRef(null);

  const openNow = (label) => {
    clearTimeout(closeTimer.current);
    setOpenTab(label);
  };

  const closeSoon = () => {
    closeTimer.current =
      setTimeout(
        () => setOpenTab(null),
        140
      );
  };

  useEffect(() => {
    const onClickAway = (e) => {
      if (
        !navRef.current?.contains(
          e.target
        )
      ) {
        setOpenTab(null);
      }
    };

    const onEscape = (e) => {
      if (e.key === "Escape") {
        setOpenTab(null);
      }
    };

    document.addEventListener(
      "mousedown",
      onClickAway
    );

    document.addEventListener(
      "keydown",
      onEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        onClickAway
      );

      document.removeEventListener(
        "keydown",
        onEscape
      );
    };
  }, []);

  const activeMenu = menu?.find(
    (m) => m.label === openTab
  );

  /*
   * LOGIN / LOGOUT
   */
  const handleLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuthenticated) {
      onLogout?.();
      return;
    }

    if (
      typeof onLogin === "function"
    ) {
      onLogin();
    } else {
      console.error(
        "Login handler is not connected."
      );
    }
  };

  /*
   * CART
   */
  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      typeof onCartClick === "function"
    ) {
      onCartClick();
    } else {
      console.error(
        "Cart handler is not connected."
      );
    }
  };

  return (
    <header className="header">
      <div className="header__bar">

        {/* LOGO */}
        <a
          href="/"
          className="logo-tab"
          aria-label="SharePal home"
        >
          <span className="logo-tab__word">
            Share<em>Pal</em>
          </span>
        </a>

        {/* LOCATION + DATES */}
        <div className="pill">

          <label className="pill__city">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
              <circle
                cx="12"
                cy="10"
                r="2.5"
              />
            </svg>

            <select
              value={city}
              onChange={(e) =>
                onCityChange(
                  e.target.value
                )
              }
              aria-label="Select city"
            >
              {cities.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <DateChip
            label="Delivery Date"
            value={delivery}
            min={todayIso()}
            onChange={onDelivery}
          />

          <DateChip
            label="Pickup Date"
            value={pickup}
            min={
              delivery ||
              todayIso()
            }
            onChange={onPickup}
          />

          <button
            type="button"
            className="pill__select"
            onClick={onApplyDates}
          >
            <CalendarIcon />
            Select
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="header__right">

          {/* SEARCH */}
          <button
            type="button"
            className="icon-btn"
            aria-label="Search"
            onClick={onSearchClick}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {/* CART */}
          <button
            type="button"
            className="icon-btn"
            aria-label={`Cart, ${cartCount || 0
              } items`}
            onClick={handleCartClick}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />

              <circle
                cx="9.5"
                cy="20"
                r="1.3"
              />

              <circle
                cx="17"
                cy="20"
                r="1.3"
              />
            </svg>

            {cartCount > 0 && (
              <span className="badge">
                {cartCount}
              </span>
            )}
          </button>

          {/* LOGIN / USER */}
          <button
            type="button"
            className="login"
            onClick={handleLoginClick}
            aria-label={
              isAuthenticated
                ? "Logout"
                : "Login"
            }
          >
            <span className="login__avatar">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                />

                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
              </svg>
            </span>

            <span className="login__text">
              {isAuthenticated
                ? `Hi, ${user?.phone?.slice(
                  -4
                ) ||
                user?.name ||
                "User"
                }`
                : "Hi, Login"}
            </span>
          </button>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <div
        className="nav"
        ref={navRef}
        onMouseLeave={closeSoon}
        onMouseEnter={() =>
          clearTimeout(
            closeTimer.current
          )
        }
      >
        <nav
          className="tabs"
          aria-label="Categories"
        >
          {menu.map(
            ({ label }) => (
              <button
                key={label}
                type="button"
                className={`tabs__btn ${label === CURRENT_TAB
                    ? "is-current"
                    : ""
                  } ${openTab === label
                    ? "is-open"
                    : ""
                  }`}
                aria-haspopup="true"
                aria-expanded={
                  openTab === label
                }
                onMouseEnter={() =>
                  openNow(label)
                }
                onFocus={() =>
                  openNow(label)
                }
                onClick={() => {
                  onCategoryClick?.(label);

                  if (openTab === label) {
                    setOpenTab(null);
                  } else {
                    openNow(label);
                  }
                }}
              >
                {label}
              </button>
            )
          )}
        </nav>

        {/* MEGA MENU */}
        {activeMenu && (
          <div
            className="mega"
            role="menu"
            key={activeMenu.label}
          >
            <ul className="mega__grid">
              {activeMenu.items.map(
                (item) => (
                  <li
                    key={item.label}
                  >
                    <a
                      href="#"
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();

                        setOpenTab(
                          null
                        );

                        onMenuPick(
                          item
                        );
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}