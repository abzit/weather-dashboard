const City = require('../models/City');
const User = require('../models/User');

// Get all cities for current user
exports.getCities = async (req, res, next) => {
  try {
    const cities = await City.find({ userId: req.userId }).sort({ isFavorite: -1, createdAt: -1 });
    res.json(cities);
  } catch (error) {
    next(error);
  }
};

// Add a new city
exports.addCity = async (req, res, next) => {
  try {
    const { name, country, latitude, longitude } = req.body;

    if (!name || !country || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if city already added by user
    const existingCity = await City.findOne({
      userId: req.userId,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCity) {
      return res.status(400).json({ message: 'City already added' });
    }

    const city = new City({
      name,
      country,
      latitude,
      longitude,
      userId: req.userId,
    });

    await city.save();
    res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

// Delete a city
exports.deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Ensure user owns this city
    if (city.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this city' });
    }

    await City.findByIdAndDelete(id);
    res.json({ message: 'City deleted' });
  } catch (error) {
    next(error);
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Ensure user owns this city
    if (city.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to modify this city' });
    }

    city.isFavorite = !city.isFavorite;
    await city.save();

    res.json(city);
  } catch (error) {
    next(error);
  }
};