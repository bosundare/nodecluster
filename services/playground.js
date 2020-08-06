process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const Alert = require('../models/alert');
const moment = require('moment-timezone')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cluster = require('../models/cluster');
const config = require('../config/secret');
const logger = require('../config/logger')
const axios = require('axios');


axios.defaults.headers.common ['Authorization'] = config.axiosauth;


const start = async () => {
      
  try {
    // step 1
    await Alert.destroy({where: {},truncate: true}).then(console.log('Table cleared'));
  
    // step 2
    await Cluster.findAll({
      where: { 
        [Op.or]: [
        // {
        //   clustername: {[Op.like]: '%PHX-POC006%'}
        // },
        {
          clustername: {[Op.like]: '%PHX-POC068%'}
        },
        // {
        //   clustername: {[Op.like]: '%PHX-POC086%'}
        // }
        ]
          
      }
  
  })
    .then(
      cluster => {
        cluster.forEach(
            cluster => {
                let clusterId = cluster.id
                Alert.create(
                    {
                      totalalerts: '0',
                      status: 'unchecked',
                      clusterId: clusterId,
                      alerts: 'none'
                  }
                  )
                
            }
        )
      }
    ).then(console.log('Alerts table populated'));
  
    // commit
    await Alert.findAll({
      where: {
         status: {[Op.eq]: 'unchecked'}
      }, include: Cluster 
    
    })
    .then(
      alert => {
        alert.forEach(
          alert => {
          
          let cip = alert.cluster.clusterip
          let alerttotalnum = 0
          let alertmessage = []

        axios.all([
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A1082', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A15030', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A101048', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A1069', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=1165', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A1050', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A1187', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A106017', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A106053', {timeout: 5000}),
          axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A1137', {timeout: 5000}),
          
        ])
          
          .then(axios.spread((nic,ipmi,offlinedisk,storagehealth,satadom,rcmperror,dimmeccerror,smsgdrive,boordrive,nodefail) => {
            let axiosresponses = [nic,ipmi,offlinedisk,storagehealth,satadom,rcmperror,dimmeccerror,smsgdrive,boordrive,nodefail]
            axiosresponses.forEach(
              axiosres => {
                
                
                let alertnum = axiosres.data.metadata.total_entities
                
                if (alertnum > 0 ) {
                  alerttotalnum = alerttotalnum + 1
                  alertmessage.push(axiosres.data.entities[0].alert_title)
                  
                  }
              }
            )
            if (alerttotalnum > 0) {
              alert.update({
                totalalerts: alerttotalnum,
                alerts: alertmessage.join(","),
                status: 'checked'
              })
            } else {
              alert.update({
                totalalerts: alerttotalnum,
                alerts: 'none',
                status: 'checked'
              })
            }
          })
          
          )
          .catch(err => {
            if (err) {
              if (err.code == 'ECONNREFUSED'){
                
                alert.update({
                  totalalerts: 0,
                  alerts: 'none',
                  status: 'unreachable'
                })
                
                
                }
            else if (err.response.status == 401) {
                
                alert.update({
                  totalalerts: 0,
                  alerts: 'none',
                  status: 'autherror'
                })  
                 
            }
           
            } 
            }
            )
          }
        )
      }
    );
  
  } catch (err) {
    // Rollback transaction if any errors were encountered
     console.log(err);
  }
}

start()