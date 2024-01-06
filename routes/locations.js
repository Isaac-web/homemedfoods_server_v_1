const express = require('express');
const {
  createLocation,
  getLocation,
  setLocation,
} = require('../controllers/locations');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', [auth('rider')], setLocation);
router.get('/', getLocation);

module.exports = router;
