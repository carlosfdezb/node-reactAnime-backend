const express = require('express');
const routes = require('./routes/index');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'ReactAnime API - 👋🌎🌍🌏',
    author: 'Carlos Fernández',
    entries: [
      {
        'LatestAnimeAdded': '/api/v1/LatestAnimeAdded',
        'other-entries': 'soon',
      }
    ]
  });
});

router.use('/', routes);

module.exports = router;