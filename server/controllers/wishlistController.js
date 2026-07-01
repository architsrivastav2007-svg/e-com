import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const buildWishlistResponse = (wishlistDocument) => {
  const products = wishlistDocument?.products || [];

  return {
    success: true,
    totalItems: products.length,
    wishlist: {
      _id: wishlistDocument?._id,
      user: wishlistDocument?.user,
      products,
      createdAt: wishlistDocument?.createdAt,
      updatedAt: wishlistDocument?.updatedAt,
    },
  };
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate('products');
  }

  return wishlist;
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);

    return res.status(200).json(buildWishlistResponse(wishlist));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const alreadyExists = wishlist.products.some((item) => item._id.toString() === productId);

    if (alreadyExists) {
      return res.status(200).json({
        ...buildWishlistResponse(wishlist),
        message: 'Product already in wishlist',
      });
    }

    wishlist.products.push(product._id);
    await wishlist.save();
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    return res.status(201).json({
      ...buildWishlistResponse(updatedWishlist),
      message: 'Product added to wishlist',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user._id);
    const nextProducts = wishlist.products.filter((item) => item._id.toString() !== productId);

    if (nextProducts.length === wishlist.products.length) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist',
      });
    }

    wishlist.products = nextProducts;
    await wishlist.save();
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    return res.status(200).json({
      ...buildWishlistResponse(updatedWishlist),
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    wishlist.products = [];
    await wishlist.save();

    return res.status(200).json({
      success: true,
      totalItems: 0,
      wishlist: {
        _id: wishlist._id,
        user: wishlist.user,
        products: [],
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      },
      message: 'Wishlist cleared',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
