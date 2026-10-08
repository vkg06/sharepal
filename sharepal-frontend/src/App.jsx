import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Banner from "./components/Banner.jsx";
import Toolbar from "./components/Toolbar.jsx";
import ProductCard from "./components/ProductCard.jsx";
import Faq from "./components/Faq.jsx";
import Breadcrumbs from "./components/Breadcrumbs.jsx";
import Orders from "./components/Orders.jsx";
import CategoryLinks from "./components/CategoryLinks.jsx";
import SeoCopy from "./components/SeoCopy.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import { CalendarIcon } from "./components/icons.jsx";
import { useWishlist } from "./hooks/useWishlist.js";
import { api } from "./api/client.js";
import { useAuth } from "./context/AuthContext.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import { useCart } from "./context/CartContext.jsx";

const SORTERS = {
  popular: (a, b) =>
    b.booked_count - a.booked_count,

  priceLow: (a, b) =>
    a.per_day_rent - b.per_day_rent,

  priceHigh: (a, b) =>
    b.per_day_rent - a.per_day_rent,

  rating: (a, b) =>
    b.rating - a.rating,
};

const daysBetween = (from, to) =>
  Math.max(
    1,
    Math.round(
      (new Date(to) - new Date(from)) /
        86400000
    )
  );

export default function App() {
  const [content, setContent] = useState(null);

  const [rawData, setRawData] = useState([]);

  const [city, setCity] =
    useState("Bangalore");

  const [delivery, setDelivery] =
    useState("");

  const [pickup, setPickup] =
    useState("");

  const [rentalDays, setRentalDays] =
    useState(0);

  const [priceQuotes, setPriceQuotes] =
    useState({});

  const [subCategory, setSubCategory] =
    useState("all");

  const [mainCategory, setMainCategory] =
    useState("gaming");

  const [query, setQuery] =
    useState("");

  const [sort, setSort] =
    useState("popular");

  const [inStockOnly, setInStockOnly] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const [loadError, setLoadError] =
    useState("");

  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  const {
    saved,
    toggle,
  } = useWishlist();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const {
    cart,
    addToCart,
  } = useCart();

  const [authOpen, setAuthOpen] =
    useState(false);

  const [authMode, setAuthMode] =
    useState("login");

  const [cartOpen, setCartOpen] =
    useState(false);

  /*
   * AUTH MODAL
   */

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  /*
   * MAIN CATEGORY MAP
   *
   * These are navigation categories.
   * The assessment product JSON does NOT contain
   * a category field, so we do not add one.
   */

  const mainCategoryMap = {
    Photography: "photography",
    Gaming: "gaming",
    Outdoor: "outdoor",
    Entertainment: "entertainment",
  };

  /*
   * LOAD BACKEND DATA
   */

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getContent(),
    ])
      .then(
        ([products, siteContent]) => {
          setRawData(
            Array.isArray(products)
              ? products
              : products?.products || []
          );

          setContent(siteContent);
        }
      )
      .catch((error) => {
        console.error(error);

        setLoadError(
          "Unable to load the latest data. Please make sure the backend is running."
        );
      });
  }, []);

  const subCategories =
    content?.subCategories || [];

  /*
   * PRODUCT FILTERING
   *
   * The supplied assessment JSON has:
   *
   * id
   * name
   * image
   * rating
   * booked_count
   * per_day_rent
   * out_of_stock
   * tag
   *
   * It does NOT have a category field.
   *
   * Therefore Gaming subcategories are determined
   * from the existing product name.
   */

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchGamingSubCategory = (product) => {
      switch (subCategory) {
        case "all":
          return true;

        case "gta":
          return /GTA\s*VI/i.test(
            product.name
          );

        case "ps5":
          return (
            /^PS5/i.test(product.name) &&
            !/Racing Wheel/i.test(
              product.name
            )
          );

        case "xbox":
          return /Xbox/i.test(
            product.name
          );

        case "vr":
          return (
            /\bVR\b/i.test(
              product.name
            ) ||
            /VR Headset/i.test(
              product.name
            ) ||
            /Virtual Reality/i.test(
              product.name
            )
          );

        case "racing":
          return (
            /Racing Wheel/i.test(
              product.name
            ) ||
            /Racing/i.test(
              product.name
            )
          );

        case "big-screen":
          return (
            /Big Screen/i.test(
              product.name
            ) ||
            /Projector/i.test(
              product.name
            ) ||
            /Gaming Screen/i.test(
              product.name
            ) ||
            /\bTV\b/i.test(
              product.name
            )
          );

        default:
          return true;
      }
    };

    return rawData
      /*
       * Only Gaming currently has products in the
       * supplied assessment dataset.
       */
      .filter(() => {
        if (mainCategory === "gaming") {
          return true;
        }

        return false;
      })

      /*
       * Gaming sidebar filter
       */
      .filter((product) => {
        if (
          mainCategory === "gaming"
        ) {
          return matchGamingSubCategory(
            product
          );
        }

        return true;
      })

      /*
       * Search
       */
      .filter((product) =>
        q
          ? product.name
              .toLowerCase()
              .includes(q)
          : true
      )

      /*
       * Stock filter
       */
      .filter((product) =>
        inStockOnly
          ? !product.out_of_stock
          : true
      )

      /*
       * Sorting
       */
      .sort((a, b) => {
        if (
          a.out_of_stock !==
          b.out_of_stock
        ) {
          return a.out_of_stock
            ? 1
            : -1;
        }

        return (
          SORTERS[sort] ||
          SORTERS.popular
        )(a, b);
      });
  }, [
    rawData,
    subCategory,
    mainCategory,
    query,
    sort,
    inStockOnly,
  ]);

  /*
   * APPLY RENTAL DATES
   */

  const applyDates = async () => {
    if (!delivery || !pickup) {
      showToast(
        "Pick both delivery and pickup dates first."
      );

      return;
    }

    if (pickup < delivery) {
      showToast(
        "Pickup date can't be before delivery."
      );

      return;
    }

    try {
      const quote =
        await api.quote(
          rawData.map(
            (p) => p.id
          ),
          delivery,
          pickup
        );

      const nextQuotes =
        Object.fromEntries(
          quote.items.map(
            (item) => [
              item.productId,
              item,
            ]
          )
        );

      setPriceQuotes(
        nextQuotes
      );

      setRentalDays(
        quote.rentalDays
      );

      showToast(
        `Prices updated for ${
          quote.rentalDays
        } ${
          quote.rentalDays === 1
            ? "day"
            : "days"
        }.`
      );
    } catch (error) {
      showToast(
        error.message ||
          "Couldn't calculate rental prices."
      );
    }
  };

  /*
   * MAIN CATEGORY CLICK
   */

  const handleCategoryClick = (
    label
  ) => {
    const category =
      mainCategoryMap[label];

    if (!category) return;

    setMainCategory(category);

    if (category === "gaming") {
      setSubCategory("all");
    } else {
      setSubCategory(null);
    }

    setQuery("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * DROPDOWN CATEGORY CLICK
   */

  const handleMenuPick = (
    item
  ) => {
    if (item?.sub) {
      setMainCategory("gaming");
      setSubCategory(item.sub);
      setQuery("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    showToast(
      `${
        item?.label ||
        "This category"
      } is currently available in the navigation.`
    );
  };

  /*
   * RENTAL DATE PROMPT
   */

  const promptForDates = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    showToast(
      "Choose your delivery and pickup dates at the top, then press Select."
    );
  };

  /*
   * SEARCH
   */

  const focusSearch = () => {
    searchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    searchRef.current?.focus();
  };

  /*
   * TOAST
   */

  const showToast = (
    message
  ) => {
    clearTimeout(
      toastTimer.current
    );

    setToast(message);

    toastTimer.current =
      setTimeout(
        () => setToast(""),
        2600
      );
  };

  /*
   * LOADING / ERROR
   */

  if (loadError) {
    return (
      <div className="empty">
        <p>{loadError}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="empty">
        <p>Loading...</p>
      </div>
    );
  }

  /*
   * NOTIFY
   */

  const notify = async (
    product
  ) => {
    try {
      await api.notify(
        product.id
      );

      showToast(
        `We'll let you know when "${product.name}" is back.`
      );
    } catch {
      showToast(
        "Couldn't save your notification request."
      );
    }
  };

  /*
   * VOTE
   */

  const vote = async (
    product
  ) => {
    try {
      await api.vote(
        product.id
      );

      setRawData((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                booked_count:
                  p.booked_count +
                  1,
              }
            : p
        )
      );

      showToast(
        "Thanks! Your vote has been counted."
      );
    } catch {
      showToast(
        "Couldn't record your vote."
      );
    }
  };

  /*
   * RENT / ADD TO CART
   */

  const rent = async (
    product
  ) => {
    try {
      if (!isAuthenticated) {
        setAuthMode("login");
        setAuthOpen(true);

        showToast(
          "Please login to add products to your cart."
        );

        return;
      }

      if (
        !delivery ||
        !pickup ||
        rentalDays < 1
      ) {
        promptForDates();
        return;
      }

      /*
       * Check availability if the backend
       * supports the availability endpoint.
       */

      if (
        typeof api.availability ===
        "function"
      ) {
        const availability =
          await api.availability(
            product.id,
            {
              city,
              delivery,
              pickup,
            }
          );

        if (
          !availability.available
        ) {
          showToast(
            `"${product.name}" is not available for those dates.`
          );

          return;
        }
      }

      await addToCart(
        product.id,
        1
      );

      setCartOpen(true);

      showToast(
        `"${product.name}" added to your cart.`
      );
    } catch (error) {
      showToast(
        error.message ||
          "Couldn't add the product to your cart."
      );
    }
  };

  /*
   * PAGE
   */

  const pageTitle =
    mainCategory === "gaming"
      ? "Gaming On Rent"
      : mainCategory ===
        "photography"
      ? "Photography On Rent"
      : mainCategory ===
        "outdoor"
      ? "Outdoor On Rent"
      : mainCategory ===
        "entertainment"
      ? "Entertainment On Rent"
      : "Gaming On Rent";

  return (
    <>
      <Header
        city={city}
        cities={content.cities}
        onCityChange={setCity}
        delivery={delivery}
        pickup={pickup}
        onDelivery={setDelivery}
        onPickup={setPickup}
        onApplyDates={applyDates}
        savedCount={saved.length}
        onSearchClick={focusSearch}
        onMenuPick={handleMenuPick}
        onCategoryClick={
          handleCategoryClick
        }
        menu={content.menu}
        cartCount={
          cart.itemCount
        }
        onCartClick={() =>
          setCartOpen(true)
        }
        user={user}
        isAuthenticated={
          isAuthenticated
        }
        onLogin={openLogin}
        onLogout={logout}
      />

      <main className="shell">
        <Sidebar
          items={
            mainCategory ===
            "gaming"
              ? subCategories
              : []
          }
          active={subCategory}
          onPick={
            setSubCategory
          }
        />

        <div className="content">
          <Banner city={city} />

          <div className="heading">
            <h1>
              {pageTitle}
            </h1>

            <p>
              Total items:{" "}
              <b>
                {products.length}{" "}
                items
              </b>
            </p>
          </div>

          <Toolbar
            query={query}
            onQuery={setQuery}
            sort={sort}
            onSort={setSort}
            inStockOnly={
              inStockOnly
            }
            onInStockOnly={
              setInStockOnly
            }
            searchRef={
              searchRef
            }
          />

          {products.length ===
          0 ? (
            <div className="empty">
              <p>
                {mainCategory ===
                "gaming"
                  ? "No gaming gadgets match your filters."
                  : `No ${mainCategory} products are available in the supplied dataset.`}
              </p>

              <button
                className="btn btn--ghost"
                onClick={() => {
                  setQuery("");
                  setInStockOnly(
                    false
                  );

                  if (
                    mainCategory ===
                    "gaming"
                  ) {
                    setSubCategory(
                      "all"
                    );
                  }
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="grid">
              {products.map(
                (
                  product,
                  i
                ) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    index={i}
                    rentalDays={
                      rentalDays
                    }
                    isSaved={saved.includes(
                      product.id
                    )}
                    onToggleSave={() =>
                      toggle(
                        product.id
                      )
                    }
                    onNotify={() =>
                      notify(
                        product
                      )
                    }
                    onVote={() =>
                      vote(
                        product
                      )
                    }
                    onRent={() =>
                      rent(
                        product
                      )
                    }
                    priceTotal={
                      priceQuotes[
                        product.id
                      ]?.total
                    }
                  />
                )
              )}
            </ul>
          )}
        </div>
      </main>

      <section className="below container">
        <Faq
          faqs={
            content.faqs
          }
          moreFaqs={
            content.moreFaqs
          }
        />

        <Breadcrumbs
          city={city}
        />
      </section>

      <Orders
        data={content.orders}
      />

      <div className="dark">
        <CategoryLinks
          groups={
            content.categoryGroups
          }
          onPick={
            handleMenuPick
          }
        />

        <SeoCopy
          city={city}
          data={content.seo}
        />

        <Footer
          columns={
            content.footerColumns
          }
        />
      </div>

      {rentalDays === 0 && (
        <button
          className="dates-pill"
          onClick={
            promptForDates
          }
        >
          <CalendarIcon />
          Select rental dates
          to view prices
        </button>
      )}

      <Toast
        message={toast}
      />

      <button
        className="chat"
        aria-label="Chat with us"
      >
        <span className="chat__back" />
        <span className="chat__bubble">
          <i />
          <i />
          <i />
        </span>
      </button>

      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
        rentalDays={
          rentalDays
        }
        onCheckout={() => {
          setCartOpen(false);

          showToast(
            "Checkout will be available next."
          );
        }}
      />
    </>
  );
}