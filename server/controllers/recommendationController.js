import Product from '../models/Product.js';
import { getRecommendationBuckets } from '../utils/recommendationEngine.js';

const getRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).select('category price');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const recommendations = await getRecommendationBuckets(product);

    return res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID',
    });
  }
};

export { getRecommendations };
