import Product from '../models/Product.js';

const isValidPrice = (price) => Number(price) > 0;
const isValidStock = (stock) => Number(stock) >= 0;

const normalizeImages = (images) => {
  if (images === undefined) {
    return undefined;
  }

  const imageList = Array.isArray(images) ? images : [images];

  return imageList
    .map((image) => {
      if (typeof image === 'string') {
        return image.trim();
      }

      if (image && typeof image === 'object' && typeof image.url === 'string') {
        return image.url.trim();
      }

      return '';
    })
    .filter(Boolean);
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const parseNumber = (value) => {
  if (value === undefined) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, brand, stock, images, rating, numReviews, featured } = req.body;
    const normalizedImages = normalizeImages(images);

    if (!title || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, category, and stock are required',
      });
    }

    if (!isValidPrice(price)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0',
      });
    }

    if (!isValidStock(stock)) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      brand,
      stock,
      images: normalizedImages ?? [],
      rating,
      numReviews,
      featured,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      inStock,
      sort,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNumber = parsePositiveInteger(page, 1);
    const limitNumber = parsePositiveInteger(limit, 10);

    if (pageNumber === null || limitNumber === null) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers',
      });
    }

    const allowedSortValues = new Set(['price_asc', 'price_desc', 'rating', 'newest']);

    if (sort && !allowedSortValues.has(sort)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sort value. Use price_asc, price_desc, rating, or newest',
      });
    }

    const minPriceValue = parseNumber(minPrice);
    const maxPriceValue = parseNumber(maxPrice);

    if (minPriceValue === null || maxPriceValue === null) {
      return res.status(400).json({
        success: false,
        message: 'minPrice and maxPrice must be valid numbers',
      });
    }

    if (minPriceValue !== undefined && minPriceValue < 0) {
      return res.status(400).json({
        success: false,
        message: 'minPrice cannot be negative',
      });
    }

    if (maxPriceValue !== undefined && maxPriceValue < 0) {
      return res.status(400).json({
        success: false,
        message: 'maxPrice cannot be negative',
      });
    }

    if (minPriceValue !== undefined && maxPriceValue !== undefined && minPriceValue > maxPriceValue) {
      return res.status(400).json({
        success: false,
        message: 'minPrice cannot be greater than maxPrice',
      });
    }

    if (inStock !== undefined && !['true', 'false'].includes(String(inStock).toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'inStock must be true or false',
      });
    }

    const query = {};

    if (keyword) {
      const escapedKeyword = escapeRegExp(keyword);

      query.$or = [
        { title: { $regex: escapedKeyword, $options: 'i' } },
        { description: { $regex: escapedKeyword, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPriceValue !== undefined || maxPriceValue !== undefined) {
      query.price = {};

      if (minPriceValue !== undefined) {
        query.price.$gte = minPriceValue;
      }

      if (maxPriceValue !== undefined) {
        query.price.$lte = maxPriceValue;
      }
    }

    if (inStock !== undefined) {
      query.stock = String(inStock).toLowerCase() === 'true' ? { $gt: 0 } : 0;
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sortOption).skip(skip).limit(limitNumber),
    ]);

    const totalPages = totalProducts === 0 ? 0 : Math.ceil(totalProducts / limitNumber);

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID',
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { price, stock, images } = req.body;

    if (price !== undefined && !isValidPrice(price)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0',
      });
    }

    if (stock !== undefined && !isValidStock(stock)) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });
    }

    const updatePayload = { ...req.body };

    if (images !== undefined) {
      updatePayload.images = normalizeImages(images);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID',
    });
  }
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
