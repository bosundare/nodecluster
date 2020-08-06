const config = require('../config/secret');
const axios = require('axios');
const e = require('express');
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
axios.defaults.headers.common ['Authorization'] = config.axiosauth;

const scan = () => {
    axios
    .get('https://10.55.42.37:9440/PrismGateway/services/rest/v2.0/alerts/?alert_type_uuid=A103090', {
      timeout: 5000
    })
    .then(res => {
        let alert = res.data.metadata.total_entities
        if (alert > 0) {
            console.log('error present for this UUID')
        } else {
            console.log('No alerts present for this UUID')
        }
    })
    
    .catch(err => {
        if (err.code == 'ECONNREFUSED'){
            console.log('Unreachable')}
        else if (err.response.status == 401) {
            console.log('autherror')
        }
            
        } )
        
    
 
}
scan()