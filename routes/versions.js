const express = require('express');
const {
  createVersion,
  updateVersion,
  fetchVersion,
} = require('../controllers/versions');

const router = express.Router();

router.get('/mobile', fetchVersion);
router.post('/mobile', createVersion);
router.patch('/mobile/update', updateVersion);
router.delete('/mobile/:id', updateVersion);

module.exports = router;
