const {
  Location,
  validateLocation,
  validateLocationUpdate,
} = require('../models/Location');
const { User } = require('../models/User');

const setLocation = async (req, res) => {
  const { error } = validateLocation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  let location = await Location.findOne({ userId: user._id });
  if (location) {
    location = await Location.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $set: {
          coords: {
            lng: req.body.coords.lng,
            lan: req.body.coords.lan,
          },
        },
      },
      { new: true }
    );
  } else {
    location = await Location.create({
      userId: user._id,
      coords: {
        lng: req.body.coords.lng,
        lat: req.body.coords.lan,
      },
    });
  }

  res.json({ location });
};

const getLocation = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(404).json({ message: 'Location not found.' });

  const location = await Location.findOne({ userId });

  res.json({ location });
};

// const updateLocation = async (req, res) => {
//   const { error } = validateLocationUpdate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   const { userId } = req.query;

//   if (!userId) return res.status(404).json({ message: 'Location not found.' });

//   const location = await Location.findOneAndUpdate(
//     { userId },
//     {
//       $set: {
//         coords: {
//           lng: req.body.coords.lng,
//           lan: req.body.coords.lan,
//         },
//       },
//     },
//     { new: true }
//   );

//   res.json({ location });
// };

module.exports.setLocation = setLocation;
module.exports.getLocation = getLocation;
