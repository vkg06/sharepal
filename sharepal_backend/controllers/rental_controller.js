const Product = require('../models/product_model');
const Interaction = require('../models/interaction_model');

const clientId = req => String(req.headers['x-client-id'] || '').trim();
const parseDates = (delivery, pickup) => {
  if (!delivery || !pickup || !/^\d{4}-\d{2}-\d{2}$/.test(delivery) || !/^\d{4}-\d{2}-\d{2}$/.test(pickup)) {
    return { error: 'Valid delivery and pickup dates are required' };
  }
  const start = new Date(`${delivery}T00:00:00.000Z`);
  const end = new Date(`${pickup}T00:00:00.000Z`);
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return { error: 'Invalid rental dates' };
  if (start < today) return { error: 'Delivery date cannot be in the past' };
  if (end < start) return { error: 'Pickup date cannot be before delivery' };
  const days = Math.max(1, Math.ceil((end - start) / 86400000));
  return { delivery, pickup, days };
};

exports.quote = async (req, res) => {
  const dates = parseDates(req.body.delivery, req.body.pickup);
  if (dates.error) return res.status(400).json({ message: dates.error });
  const ids = Array.isArray(req.body.productIds) ? [...new Set(req.body.productIds.map(Number).filter(Number.isFinite))] : [];
  if (!ids.length) return res.status(400).json({ message: 'At least one product is required' });
  const products = await Product.find({ id: { $in: ids } });
  res.json({ delivery: dates.delivery, pickup: dates.pickup, rentalDays: dates.days,
    items: products.map(p => ({ productId: p.id, perDayRent: p.per_day_rent, rentalDays: dates.days,
      total: Math.round(p.per_day_rent * dates.days * 100) / 100, available: !p.out_of_stock })) });
};

exports.getOrders = async (req, res) => {
  const cid = clientId(req);
  if (!cid) return res.status(400).json({ message: 'x-client-id header is required' });
  const rows = await Interaction.find({ clientId: cid, type: 'rental' }).sort({ createdAt: -1 }).lean();
  res.json(rows);
};
