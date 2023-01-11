const { Slider, validate } = require("../models/Slider");
const { deleteFile } = require("../utils/uploader");

const createSlider = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const slider = Slider({
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.desctription,
    "image.url": req.body.imageUrl,
    "image.public_id": req.body.imagePublicId,
  });

  await slider.save();

  res.send(slider);
};

const getSliders = async (req, res) => {
  const [sliders, count] = await Promise.all([
    Slider.find(),
    Slider.find().count(),
  ]);

  res.send({ sliders, count });
};

const getSlider = async (req, res) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) return req.status(404).send("Slider not found.");

  res.send(slider);
};

const updateSlider = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const slider = await Slider.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.desctription,
        "image.url": req.body.imageUrl,
        "image.public_id": req.body.imagePublicId,
      },
    },
    { new: true }
  );

  if (!slider) return res.status(404).send("Slider not found.");

  res.send(slider);
};

const deleteSlider = async (req, res) => {
  const slider = await Slider.findByIdAndRemove(req.params.id);

  if (slider.image.public_id) {
    try {
      result = await deleteFile(slider.image.public_id);
    } catch (err) {
      return res.status(500).send("Could not delete slider.");
    }
  }

  if (!slider) return res.status(404).send("Slider not found.");

  res.send(slider);
};

exports.createSlider = createSlider;
exports.getSliders = getSliders;
exports.getSlider = getSlider;
exports.updateSlider = updateSlider;
exports.deleteSlider = deleteSlider;
