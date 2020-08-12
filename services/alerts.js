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


const service = () => {
    setInterval(() => {
        start()
    },6 * 60 * 60 * 1000)

    const start = async () => {
      
      try {
        await Alert.destroy({where: {},truncate: true}).then(console.log('Table cleared'));
        await Cluster.findAll({
          where: { 
            [Op.or]: [
            {
              clustername: {[Op.like]: '%%'}
            },
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
                          status: 'Unchecked',
                          clusterId: clusterId,
                          alerts: 'none'
                      }
                      )
                    
                }
            )
          }
        ).then(console.log('Alerts table populated'));
      
        await Alert.findAll({
          where: {
             status: {[Op.eq]: 'Unchecked'}
          }, include: Cluster 
        
        })
        .then(
           alert => {
            alert.forEach(
               async alert => {
              
              let cip = alert.cluster.clusterip
              let alerttotalnum = 0
              let alertmessage = []
    
             await axios.all([
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
              axios.get('https://'+cip+':9440/PrismGateway/services/rest/v2.0/alerts/?resolved=false&alert_type_uuid=A15039', {timeout: 5000})
              
            ])
              .then(axios.spread((nic,ipmi,offlinedisk,storagehealth,satadom,rcmperror,dimmeccerror,smsgdrive,boordrive,nodefail,dimmuccerror) => {
                let axiosresponses = [nic,ipmi,offlinedisk,storagehealth,satadom,rcmperror,dimmeccerror,smsgdrive,boordrive,nodefail,dimmuccerror]
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
                    status: 'Checked'
                  })
                } else {
                  alert.update({
                    totalalerts: alerttotalnum,
                    alerts: 'none',
                    status: 'Checked'
                  })
                }
              })
              )
              .catch(err => {
                if (err) {
                  if (err.code){
                    alert.update({
                      totalalerts: 0,
                      alerts: 'Cluster is Unreachable',
                      status: 'Unreachable'
                    })
                  
                    }
                else if (err.response.status == 401) {
                    alert.update({
                      totalalerts: 0,
                      alerts: 'Authentication Failed for Cluster',
                      status: 'Authentication_Error'
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
 
         console.log(err);
      }
    }
}
service();
module.exports = service ;


