const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Cluster = require('../models/cluster');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const session = require('express-session');
const paginate = require('express-paginate')


router.use(paginate.middleware(20, 50));

router.get('/',async (req, res, next) =>{
  Cluster.findAndCountAll({limit: req.query.limit, offset: req.skip})
  .then(clusters =>{
    const itemCount = clusters.count;
    const pageCount = Math.ceil(clusters.count / req.query.limit);
    console.log(itemCount,pageCount)
      res.render('cluster', {
      user: req.user,
      clusters: clusters.rows,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
      
    });
    
})
.catch(err => next(err))
});

// // Display all pagianted records
// router.get('/', (req, res) => {
//   Cluster.findAll({limit: 40})
//     .then(
//       clusters => res.render('cluster', {
//             clusters, user: req.user
//         }))
//     .catch(err => console.log(err))
//   });

// Display add Cluster form
router.get('/add', ensureAuthenticated, (req, res) => res.render('add',{user: req.user}));

// Search for Clusters
router.get('/search', (req, res) => {
    let { term } = req.query;
  
    // Make Uppercase
    term = term.toUpperCase();
  
    Cluster.findAll({ where: {
      [Op.or]: [
        { 
          clustername: {[Op.like]: '%' + term + '%'}
        },
        {
          privlan: {[Op.like]: '%' + term + '%'}
        },
        {
          secvlan: {[Op.like]: '%' + term + '%'}
        },
        { 
          tor1ip: {[Op.like]: '%' + term + '%'}
        },
        {
          tor2ip: {[Op.like]: '%' + term + '%'}
        },
        {
          interface: {[Op.like]: '%' + term + '%'}
        }
      ]
                          }
   })
    
    .then(clusters => res.render('search', { clusters }))
    .catch(err => console.log(err));
  });

  //Get single cluster details
  router.get('/:id',(req,res)=>
    Cluster.findByPk(req.params.id)
    
    .then(clusters => {
      if (clusters === null) {
        {return res.status(400).send({'message': 'Query not found'})}
      }
      res.render('clusterid', {clusters})}))

    //Add Cluster 
    router.post('/add', ensureAuthenticated, (req, res) => {
      const { clustername, privlan, secvlan, tor1ip, tor2ip, interface } = req.body;
      let errors = [];
    
      if(!clustername) {
        errors.push({ text: 'Please add a Cluster Name' });
      }
      if(!privlan) {
        errors.push({ text: 'Please add a Primary Vlan' });
      }
      if(!secvlan) {
        errors.push({ text: 'Please add a secondary Vlan' });
      }
      if(!tor1ip) {
        errors.push({ text: 'Please add a TOR1 Switch IP Address' });
      }
      if(!tor2ip) {
        errors.push({ text: 'Please add a TOR2 Switch IP Address' });
      }
      if(!interface) {
        errors.push({ text: 'Please add a Physical Interface' });
      }
    
      if (errors.length > 0) {
        res.render('add', {
          errors,
          clustername,
          privlan,
          secvlan,
          tor1ip,
          tor2ip,
          interface
        });

      } else {
        Cluster.findOne({where: {clustername: req.body.clustername}})
        .then(clustername => {
          if (clustername) {
            let msg = req.body.clustername +' Already exist'
            console.log(msg)
            res.render('add', {msg,clustername:req.body.clustername,privlan,secvlan,tor1ip,tor2ip,interface});
          } else {
            
            Cluster.create({
                clustername:req.body.clustername,
                privlan,
                secvlan,
                tor1ip,
                tor2ip,
                interface
            }).then(cluster => {

              let msg = req.body.clustername +' Successfully added'
              console.log(msg)
              res.render('add', {msg, user: req.user});
            })
            
            .catch(err => console.log(err));
          }
          });
      }
    });
// Editing Cluster, but protected route
  router.get('/edit/:id', ensureAuthenticated, (req,res)=>
    Cluster.findByPk(req.params.id)
    .then(clusters => res.render('cluster_edit', {clusters, user: req.user}))
    .catch(err => console.log(err))
  )
 // Posting to  editing cluster but protected route
  router.post('/edit/:id', ensureAuthenticated,(req,res) =>
  Cluster.findByPk(req.params.id)
    .then(clusters =>{
      clusters.update({
        privlan:req.body.privlan,
        secvlan:req.body.secvlan,
        tor1ip:req.body.tor1ip,
        tor2ip:req.body.tor2ip,
        interface:req.body.interface
      }).then(cluster => {

        let msg = ' Successfully Updated'
        res.render('cluster_edit', {msg, clusters, user: req.user});
    }).catch(cluster => {

      let msg = ' Failed to Update, Check form input'
      console.log(msg)
      res.render('cluster_edit', {msg, clusters, user: req.user});
  })
  }))

  // Posting to delete cluster, but protected route
  router.get('/delete/:id', ensureAuthenticated, (req,res) =>
  Cluster.findByPk(req.params.id)
  .then(clusters =>{
    clusters.destroy({
      where: {id:req.params.id}})
      .then(cluster => {

      let msg = ' Successfully Deleted'
      console.log(msg)
      res.redirect('/cluster');
  }).catch(cluster => {

    let msg = ' Failed to Delete'
    console.log(msg)
    res.redirect('/cluster/'+req.params.id);
})
})
  );
  module.exports = router;