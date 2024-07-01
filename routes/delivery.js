const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    data: {
      delivery: 10,
    },
  });
});

module.exports = router;
