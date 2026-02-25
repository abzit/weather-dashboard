const weatherService = require('../services/weatherService');

exports.getWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const weatherData = await weatherService.getWeatherData(latitude, longitude);

    // Format response
    const current = weatherData.current;
    const formatted = {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      weatherCondition: weatherService.interpretWeatherCode(current.weather_code),
      windSpeed: current.wind_speed_10m,
      timezone: weatherData.timezone,
    };

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};