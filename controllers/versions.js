const { Version, validateVersion } = require('../models/Version');

const validPlatforms = ['android', 'ios'];
const isValidPlatform = (name) => {
  return validPlatforms.includes(name);
};

const fetchVersion = async (req, res) => {
  const platform = req.query.platform;
  const queryObject = {};
  if (platform) queryObject.platform = platform;

  const versions = await Version.find(queryObject);

  res.json({
    message: 'Results from versions',
    versions,
  });
};

const createVersion = async (req, res) => {
  const { error } = validateVersion(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!isValidPlatform(req.body.platform))
    return res.status(400).json({ message: 'Invalid platform name.' });

  let version = await Version.findOne({ platform: req.body.platform });
  if (version) res.json(version);

  version = await Version.create(req.body);
  res.json(version);
};

const updateVersion = async (req, res) => {
  const { error } = validateVersion(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const version = await Version.findOneAndUpdate(
    { platform: req.query.platform },
    {
      $set: { ...req.body, platform: req.query.platform },
    },
    { new: true }
  );

  if (!version)
    return res
      .status(404)
      .json({ message: 'The given version cannot be found.' });

  res.json({ message: 'A system version was updated', version });
};

const deleteVersion = async (req, res) => {
  const version = await Version.findByIdAndRemove(req.params.id);
  if (!apiVersion)
    return res
      .status(404)
      .json({ message: 'The version with the given id cannot be found.' });

  res.json({ message: 'An api version was deleted', version });
};

module.exports.createVersion = createVersion;
module.exports.updateVersion = updateVersion;
module.exports.fetchVersion = fetchVersion;
module.exports.deleteVersion = deleteVersion;
