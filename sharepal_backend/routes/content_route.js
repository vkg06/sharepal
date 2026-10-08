const express = require('express');
const content = require('../data/site_content');
const router = express.Router();

router.get('/', (req, res) => res.json(content));
module.exports = router;
