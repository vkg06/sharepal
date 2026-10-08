const Interaction = require('../models/interaction_model');
const Product = require('../models/product_model');

const clientId = req => String(req.headers['x-client-id'] || '').trim();

exports.getWishlist = async (req, res) => {
  const id = clientId(req);
  if (!id) return res.status(400).json({ message: 'x-client-id header is required' });
  const rows = await Interaction.find({ clientId: id, type: 'wishlist' }).select('productId -_id');
  res.json(rows.map(r => r.productId));
};

exports.toggleWishlist = async (req, res) => {
  const cid = clientId(req), productId = Number(req.params.id);
  if (!cid) return res.status(400).json({ message: 'x-client-id header is required' });
  const product = await Product.findOne({ id: productId });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const existing = await Interaction.findOne({ clientId: cid, type: 'wishlist', productId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ saved: false });
  }
  await Interaction.create({ clientId: cid, type: 'wishlist', productId });
  res.json({ saved: true });
};

exports.notify = async (req, res) => {
  const cid = clientId(req), productId = Number(req.params.id);
  if (!cid) return res.status(400).json({ message: 'x-client-id header is required' });
  const product = await Product.findOne({ id: productId });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await Interaction.create({ clientId: cid, type: 'notify', productId });
  res.status(201).json({ message: 'Notification request saved' });
};

exports.vote = async (req, res) => {
  const cid = clientId(req), productId = Number(req.params.id);
  if (!cid) return res.status(400).json({ message: 'x-client-id header is required' });
  const product = await Product.findOne({ id: productId });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await Interaction.create({ clientId: cid, type: 'vote', productId });
  await Product.updateOne({ id: productId }, { $inc: { booked_count: 1 } });
  res.status(201).json({ message: 'Vote counted' });
};

exports.rent = async (req, res) => {
  const cid = clientId(req), productId = Number(req.params.id);
  if (!cid) return res.status(400).json({ message: 'x-client-id header is required' });
  const product = await Product.findOne({ id: productId });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.out_of_stock) return res.status(409).json({ message: 'Product is out of stock' });
  const { delivery, pickup, city } = req.body || {};
  if (!delivery || !pickup || !city) return res.status(400).json({ message: 'City, delivery date and pickup date are required' });
  const start = new Date(`${delivery}T00:00:00.000Z`), end = new Date(`${pickup}T00:00:00.000Z`);
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start < today || end < start) {
    return res.status(400).json({ message: 'Please provide valid future rental dates' });
  }
  const rentalDays = Math.max(1, Math.ceil((end - start) / 86400000));
  const total = Math.round(product.per_day_rent * rentalDays * 100) / 100;
  const rental = await Interaction.create({ clientId: cid, type: 'rental', productId,
    payload: { city, delivery, pickup, rentalDays, perDayRent: product.per_day_rent, total, status: 'requested' } });
  res.status(201).json({ message: 'Rental request created', rentalId: rental._id, rentalDays, total, status: 'requested' });
};
