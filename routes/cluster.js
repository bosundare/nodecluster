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
const {clusterValidationRules,userValidationRules} = require('../config/validation')

router.get('/',async (req, res, next) =>{
  Cluster.findAndCountAll({limit: req.query.limit, offset: req.skip})
  .then(clusters =>{
    const itemCount = clusters.count;
    const pageCount = Math.ceil(clusters.count / req.query.limit);
      res.render('cluster', {
      user: req.user,
      clusters: clusters.rows,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
      
    });
    
})
.catch(err => next(err))
});

// Display add Cluster form
router.get('/add', ensureAuthenticated, (req, res) => res.render('add',{user: req.user}));

//Create Cluster
router.post('/add', ensureAuthenticated, clusterValidationRules(),
(req,res,next)=>{
  const { clustername, privlan, secvlan, tor1ip, tor2ip, interface } = req.body;
  let errors = req.validationErrors();
  if (errors) {
    console.log(errors);
       res.render('add',
        { 
         errors: errors, 
         user: req.user,
         clustername:req.body.clustername,
         privlan,
         secvlan,
         tor1ip,
         tor2ip,
         interface
        });
     } else {
      Cluster.findOne({where: {clustername: req.body.clustername}}).then(clustername => {
        if (clustername) {
          let errors = [];
          errors.push({ msg: 'Clustername already exist' });
          
          res.render('add', {errors,clustername:req.body.clustername,privlan,secvlan,tor1ip,tor2ip,interface, user: req.user});
        } else {
          
          Cluster.create({
              clustername:req.body.clustername,
              privlan,
              secvlan,
              tor1ip,
              tor2ip,
              interface
          })
          .then(cluster => {
            req.flash('success_msg','Cluster successfully added');
            res.redirect('/cluster/add');
          })          
          .catch(err => console.log(err));
        }});
    }});

// Search for Clusters
router.get('/search', async (req, res, next) => {
    let { term } = req.query;
  
    // Make Uppercase
    term = term.toUpperCase();
  
    Cluster.findAndCountAll({ where: {
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
      },limit: req.query.limit, offset: req.skip
   })
      .then(clusters =>{
      const itemCount = clusters.count;
      const pageCount = Math.ceil(clusters.count / req.query.limit);
        res.render('search', {
        user: req.user,
        clusters: clusters.rows,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
        });
  })
  .catch(err => next(err))
  });

  //Get single cluster details
  router.get('/:id',(req,res)=>
    Cluster.findByPk(req.params.id)
    
    .then(clusters => {
      if (clusters === null) {
        {return res.status(400).send({'message': 'Query not found'})}
      }
      res.render('clusterid', {clusters})}))

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
        req.flash('success_msg','Cluster successfully updated');
        res.redirect('/cluster/edit/'+req.params.id);
      }).catch(cluster => {

        req.flash('error_msg','Update failed, Check input');
        res.redirect('/cluster/edit/'+req.params.id);
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