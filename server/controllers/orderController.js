import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const calculateOrderAmounts = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCost = subtotal > 0 ? 150 : 0;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const totalPrice = Number((subtotal + tax + shippingCost).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    shippingCost,
    totalPrice,
  };
};

const mapOrderResponse = (order) => ({
  ...order.toObject(),
  items: order.items.map((item) => ({
    ...item,
    product: item.product,
  })),
});

const placeOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = 'Cash On Delivery',
    } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phoneNumber || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    const items = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in cart',
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`,
        });
      }

      items.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: Number(product.price),
        subtotal: Number((Number(product.price) * cartItem.quantity).toFixed(2)),
      });
    }

    const amounts = calculateOrderAmounts(items);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of cart.items) {
        const product = await Product.findById(item.product._id).session(session);

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product?.title || 'product'}`);
        }

        product.stock -= item.quantity;
        await product.save({ session });
      }

      const [createdOrder] = await Order.create(
        [
          {
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal: amounts.subtotal,
            tax: amounts.tax,
            shippingCost: amounts.shippingCost,
            totalPrice: amounts.totalPrice,
          },
        ],
        { session },
      );

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save({ session });

      await session.commitTransaction();
      session.endSession();

      const populatedOrder = await Order.findById(createdOrder._id)
        .populate('user', 'name email role')
        .populate('items.product', 'title price images category');

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: mapOrderResponse(populatedOrder),
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title price images category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders: orders.map(mapOrderResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('items.product', 'title price images category stock');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    return res.status(200).json({
      success: true,
      order: mapOrderResponse(order),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID',
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in ${order.orderStatus} status`,
      });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    await order.save();

    const cancelledOrder = await Order.findById(order._id)
      .populate('user', 'name email role')
      .populate('items.product', 'title price images category stock');

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: mapOrderResponse(cancelledOrder),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID',
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = new Date();
      }
      if (orderStatus === 'Cancelled') {
        order.cancelledAt = new Date();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email role')
      .populate('items.product', 'title price images category stock');

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: mapOrderResponse(updatedOrder),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { placeOrder, getMyOrders, getOrderById, cancelOrder, updateOrderStatus };
