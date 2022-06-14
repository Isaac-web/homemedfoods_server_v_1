const { City, validate, validateOnUpdate } = require("../models/City");

const createCity = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const city = new City({
    name: req.body.name,
    coordinates: {
      long: req.body.long,
      lat: req.body.lat,
    },
  });

  await city.save();

  res.send(city);
};

const getCities = async (req, res) => {
  const cities = await City.find();

  res.send(cities);
};

const updateCity = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const city = await City.findById(req.params.id);
  if (!city) return res.status(404).send("City not found.");

  if (req.body.name) city.name = req.body.name;
  if (req.body.long) city.coordinates.long = req.body.long;
  if (req.body.lat) city.coordinates.lat = req.body.lat;

  await city.save();

  res.send(city);
};

const deleteCity = async (req, res) => {
  const city = await City.findByIdAndRemove(req.params.id);

  if (!city) return res.status(404).send("City not found.");

  res.send(city);
};

module.exports = {
  createCity,
  getCities,
  updateCity,
  deleteCity,
};
