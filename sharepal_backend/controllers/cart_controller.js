const Cart = require("../models/cart_model");
const Product = require("../models/product_model");

function getUserId(req) {
  return req.user?.id;
}

async function getCartResponse(userId) {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: []
    });
  }

  const productIds = cart.items.map(
    (item) => item.productId
  );

  const products = await Product.find({
    id: { $in: productIds }
  }).lean();

  const productMap = new Map(
    products.map((product) => [
      product.id,
      product
    ])
  );

  const items = cart.items
    .map((item) => {
      const product = productMap.get(
        item.productId
      );

      if (!product) {
        return null;
      }

      return {
        productId: item.productId,
        quantity: item.quantity,

        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          per_day_rent: product.per_day_rent,
          rating: product.rating,
          out_of_stock: product.out_of_stock
        },

        linePerDay:
          product.per_day_rent *
          item.quantity
      };
    })
    .filter(Boolean);

  const itemCount = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const perDaySubtotal = items.reduce(
    (total, item) =>
      total + item.linePerDay,
    0
  );

  return {
    items,
    itemCount,
    perDaySubtotal
  };
}

/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
*/

exports.getCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const cart = await getCartResponse(
      userId
    );

    return res.json(cart);
  } catch (error) {
    console.error(
      "Get cart error:",
      error
    );

    return res.status(500).json({
      message: "Unable to load cart"
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADD TO CART
|--------------------------------------------------------------------------
*/

exports.addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const productId = Number(
      req.params.id
    );

    const requestedQuantity = Number(
      req.body?.quantity || 1
    );

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity < 1 ||
      requestedQuantity > 10
    ) {
      return res.status(400).json({
        message:
          "Quantity must be between 1 and 10"
      });
    }

    const product =
      await Product.findOne({
        id: productId
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (product.out_of_stock) {
      return res.status(409).json({
        message:
          "This product is currently out of stock"
      });
    }

    let cart = await Cart.findOne({
      userId
    });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: []
      });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.productId === productId
      );

    if (existingItem) {
      existingItem.quantity = Math.min(
        10,
        existingItem.quantity +
          requestedQuantity
      );
    } else {
      cart.items.push({
        productId,
        quantity: requestedQuantity
      });
    }

    await cart.save();

    const response =
      await getCartResponse(userId);

    return res.status(201).json(
      response
    );
  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );

    return res.status(500).json({
      message: "Unable to add product to cart"
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE QUANTITY
|--------------------------------------------------------------------------
*/

exports.updateCartItem = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const productId = Number(
      req.params.id
    );

    const quantity = Number(
      req.body?.quantity
    );

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 10
    ) {
      return res.status(400).json({
        message:
          "Quantity must be between 1 and 10"
      });
    }

    const cart =
      await Cart.findOne({
        userId
      });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (entry) =>
        entry.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        message:
          "Product is not in the cart"
      });
    }

    item.quantity = quantity;

    await cart.save();

    const response =
      await getCartResponse(userId);

    return res.json(response);
  } catch (error) {
    console.error(
      "Update cart error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update cart"
    });
  }
};

/*
|--------------------------------------------------------------------------
| REMOVE FROM CART
|--------------------------------------------------------------------------
*/

exports.removeFromCart = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const productId = Number(
      req.params.id
    );

    const cart =
      await Cart.findOne({
        userId
      });

    if (!cart) {
      return res.json({
        items: [],
        itemCount: 0,
        perDaySubtotal: 0
      });
    }

    cart.items =
      cart.items.filter(
        (item) =>
          item.productId !== productId
      );

    await cart.save();

    const response =
      await getCartResponse(userId);

    return res.json(response);
  } catch (error) {
    console.error(
      "Remove cart item error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to remove item"
    });
  }
};

/*
|--------------------------------------------------------------------------
| CLEAR CART
|--------------------------------------------------------------------------
*/

exports.clearCart = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: []
        }
      },
      {
        upsert: true
      }
    );

    return res.json({
      items: [],
      itemCount: 0,
      perDaySubtotal: 0
    });
  } catch (error) {
    console.error(
      "Clear cart error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to clear cart"
    });
  }
};