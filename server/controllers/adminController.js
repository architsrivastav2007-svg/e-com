import validator from 'validator';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const createUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const parsePositiveInteger = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const getAdminUsers = async (req, res) => {
  try {
    const { page = '1', limit = '10', search, role } = req.query;
    const pageNumber = parsePositiveInteger(page, 1);
    const limitNumber = parsePositiveInteger(limit, 10);

    if (pageNumber === null || limitNumber === null) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers',
      });
    }

    const query = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    if (role) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role filter',
        });
      }

      query.role = role;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [totalUsers, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
    ]);

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages: totalUsers === 0 ? 0 : Math.ceil(totalUsers / limitNumber),
      totalUsers,
      users: users.map(createUserResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAdminUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name is required',
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      if (!validator.isEmail(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address',
        });
      }

      const emailExists = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }

      user.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
        });
      }

      if (req.user._id.toString() === user._id.toString() && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'You cannot remove your own admin role',
        });
      }

      user.role = role;
    }

    const savedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: createUserResponse(savedUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }
};

const getAdminOrders = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parsePositiveInteger(page, 1);
    const limitNumber = parsePositiveInteger(limit, 10);

    if (pageNumber === null || limitNumber === null) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers',
      });
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [totalOrders, orders] = await Promise.all([
      Order.countDocuments({}),
      Order.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
    ]);

    const mappedOrders = orders.map((order) => ({
      _id: order._id,
      customerName: order.user?.name || 'Unknown customer',
      customerEmail: order.user?.email || '',
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemsCount: order.items.length,
    }));

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages: totalOrders === 0 ? 0 : Math.ceil(totalOrders / limitNumber),
      totalOrders,
      orders: mappedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const lowStockThreshold = 5;

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueSummary,
      recentOrders,
      lowStockProducts,
      bestSellingProducts,
    ] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
      ]),
      Order.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find({ stock: { $lte: lowStockThreshold } }).sort({ stock: 1, updatedAt: -1 }).limit(5),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            quantitySold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.subtotal' },
          },
        },
        { $sort: { quantitySold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $project: {
            _id: '$product._id',
            title: '$product.title',
            price: '$product.price',
            stock: '$product.stock',
            category: '$product.category',
            images: '$product.images',
            quantitySold: 1,
            totalRevenue: 1,
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueSummary[0]?.totalRevenue || 0,
        recentOrders: recentOrders.map((order) => ({
          _id: order._id,
          customerName: order.user?.name || 'Unknown customer',
          totalPrice: order.totalPrice,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
        })),
        lowStockProducts: lowStockProducts.map((product) => ({
          _id: product._id,
          title: product.title,
          stock: product.stock,
          price: product.price,
          category: product.category,
          images: product.images,
        })),
        bestSellingProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAdminDashboard,
  getAdminOrders,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
};