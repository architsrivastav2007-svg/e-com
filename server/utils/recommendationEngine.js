import Product from '../models/Product.js';

const RECOMMENDATION_LIMIT = 10;
const SECTION_LIMIT = 6;
const RECOMMENDATION_FIELDS = 'title price rating images category createdAt';

const buildBaseFilter = (productId) => ({
  _id: { $ne: productId },
});

const fetchRecommendationCandidates = async (product) => {
  const baseFilter = buildBaseFilter(product._id);
  const priceWindow = Number(product.price) * 0.2;
  const minPrice = Math.max(0, Number(product.price) - priceWindow);
  const maxPrice = Number(product.price) + priceWindow;

  return Promise.all([
    Product.find({ ...baseFilter, category: product.category })
      .select(RECOMMENDATION_FIELDS)
      .sort({ rating: -1, numReviews: -1, createdAt: -1 })
      .limit(SECTION_LIMIT)
      .lean(),
    Product.find({
      ...baseFilter,
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .select(RECOMMENDATION_FIELDS)
      .sort({ price: 1, rating: -1, numReviews: -1, createdAt: -1 })
      .limit(SECTION_LIMIT)
      .lean(),
    Product.find(baseFilter)
      .select(RECOMMENDATION_FIELDS)
      .sort({ rating: -1, numReviews: -1, createdAt: -1 })
      .limit(SECTION_LIMIT)
      .lean(),
    Product.find(baseFilter)
      .select(RECOMMENDATION_FIELDS)
      .sort({ createdAt: -1 })
      .limit(SECTION_LIMIT)
      .lean(),
  ]);
};

const dedupeRecommendations = (similarCategory, similarPrice, popular, recent) => {
  const usedIds = new Set();
  let totalCount = 0;

  const takeUnique = (items) => {
    const selected = [];

    for (const item of items) {
      if (totalCount >= RECOMMENDATION_LIMIT) {
        break;
      }

      const itemId = String(item._id);

      if (usedIds.has(itemId)) {
        continue;
      }

      usedIds.add(itemId);
      selected.push(item);
      totalCount += 1;
    }

    return selected;
  };

  return {
    similarCategory: takeUnique(similarCategory),
    similarPrice: takeUnique(similarPrice),
    popular: takeUnique(popular),
    recent: takeUnique(recent),
  };
};

const getRecommendationBuckets = async (product) => {
  const [similarCategory, similarPrice, popular, recent] = await fetchRecommendationCandidates(product);
  return dedupeRecommendations(similarCategory, similarPrice, popular, recent);
};

export { getRecommendationBuckets };
