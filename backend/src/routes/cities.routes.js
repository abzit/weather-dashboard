const express = require('express');
const router = express.Router();
const citiesController = require('../controllers/citiesController');
const auth = require('../middleware/auth');

router.get('/', auth, citiesController.getCities);
router.post('/', auth, citiesController.addCity);
router.delete('/:id', auth, citiesController.deleteCity);
router.patch('/:id/favorite', auth, citiesController.toggleFavorite);

module.exports = router;