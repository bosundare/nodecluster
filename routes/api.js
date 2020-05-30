const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Cluster = require('../models/cluster');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/:clustername',(req,res)=>
Cluster.findOne({where: {clustername: req.params.clustername}})
    
    .then(clusters => {
      if (clusters === null) {
        {return res.status(400).send({'message': 'Query not found'})}
      }
      res.json({clustername: clusters.clustername,
        privlan:clusters.privlan,
        secvlan:clusters.secvlan,
        tor1ip:clusters.tor1ip,
        tor2ip:clusters.tor2ip,
        interface:clusters.interface  
    })
    }))

    module.exports = router;