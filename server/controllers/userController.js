import validator from 'validator';
import User from '../models/User.js';

const createUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getMyProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: createUserResponse(req.user),
  });
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

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

    if (password !== undefined) {
      if (!password.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Password is required',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }

      user.password = password;
    }

    const savedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: createUserResponse(savedUser),
      passwordUpdated: password !== undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getMyProfile, updateMyProfile };
