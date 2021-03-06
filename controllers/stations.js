const { Station, validate, validateOnUpdate } = require("../models/Station");
const { City } = require("../models/City");
const _  = require("lodash")


const createStation = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const city = await City.findById(req.body.cityId);
  if (!city) return res.status(400).send("City not found.");

  const station = new Station({
    name: req.body.name,
    desc: req.body.desc,
    city: req.body.cityId,
    coordinates: {
      long: req.body.long,
      lat: req.body.lat,
    },
  });

  await station.save();

  station.city = city;

  res.send(station);
};

const getStations = async (req, res) => {
  const stations = await Station.find().populate("city");

  res.send(stations);
};

const getStation = async (req, res) => {
  const station = await Station.findById(req.params.id);

  if (!station) return res.status(404).send("Station not found.");

  res.send(station);
};

const updateStation = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.statu(400).send(error.details[0].message);

  const station = await Station.findById(req.params.id);
  if (!station) return res.status(404).send("Station not found.");

  //perform updates

  if(req.body.name) station.name = req.body.name;
  if (req.body.cityId) {
    const city = await City.findById(req.body.cityId);
    if (!city) return res.status(404).send("City not found.");
    station.city = city;
  }

  for (let field in req.body) station.coordinates[field] = req.body[field];
  await station.save();

  res.send(station);
};

const deleteStation = async (req, res) => {
  const station = await Station.findByIdAndRemove(req.params.id);

  if (!station) return res.status(404).send("Station not found.");

  res.send(station);
};

module.exports = {
  createStation,
  getStation,
  getStations,
  updateStation,
  deleteStation,
};
