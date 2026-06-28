import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const formatCartItem = (item) => {
  const product = item.product;
  const price = Number(product.price || 0);
  const quantity = Number(item.quantity || 0);

  return {
    product,
    quantity,
    subtotal: Number((price * quantity).toFixed(2)),
  };
};

const buildCartResponse = (cartDocument) => {
  const items = (cartDocument?.items || []).map(formatCartItem);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

  return {
    success: true,
    totalItems,
    totalPrice,
    items,
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    cart = await Cart.findById(cart._id).populate('items.product');
  }

  return cart;
};

const recalculateCartTotals = async (cart) => {
  const populatedCart = await Cart.findById(cart._id).populate('items.product');
  const totalPrice = (populatedCart.items || []).reduce((sum, item) => {
    const price = Number(item.product?.price || 0);
    return sum + price * Number(item.quantity || 0);
  }, 0);

  populatedCart.totalPrice = Number(totalPrice.toFixed(2));
  await populatedCart.save();

  return populatedCart;
};

const validateQuantityAgainstStock = (quantity, stock) => {
  if (quantity < 1) {
    return 'Quantity cannot be less than 1';
  }

  if (quantity > stock) {
    return 'Quantity cannot exceed available stock';
  }

  return null;
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const response = buildCartResponse(cart);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const requestedQuantity = Number(quantity);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    const nextQuantity = existingItem ? existingItem.quantity + requestedQuantity : requestedQuantity;

    const quantityError = validateQuantityAgainstStock(nextQuantity, product.stock);

    if (quantityError) {
      return res.status(400).json({
        success: false,
        message: quantityError,
      });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({ product: product._id, quantity: requestedQuantity });
    }

    await cart.save();
    const updatedCart = await recalculateCartTotals(cart);

    return res.status(200).json(buildCartResponse(updatedCart));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a whole number',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    const quantityError = validateQuantityAgainstStock(requestedQuantity, product.stock);

    if (quantityError) {
      return res.status(400).json({
        success: false,
        message: quantityError,
      });
    }

    existingItem.quantity = requestedQuantity;
    await cart.save();
    const updatedCart = await recalculateCartTotals(cart);

    return res.status(200).json(buildCartResponse(updatedCart));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user._id);
    const nextItems = cart.items.filter((item) => item.product.toString() !== productId);

    if (nextItems.length === cart.items.length) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    cart.items = nextItems;
    await cart.save();
    const updatedCart = await recalculateCartTotals(cart);

    return res.status(200).json(buildCartResponse(updatedCart));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      totalItems: 0,
      totalPrice: 0,
      items: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
