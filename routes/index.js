const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Cluster = require('../models/cluster');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Welcome Page
router.get('/', (req, res) => 
    Cluster.findAll()
    .then(cluster => {
        res.send(cluster);
    })
    .catch(err => console.log(err)));

// Creates the global user only if logged in
router.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
  });


module.exports = router;