const Sequelize = require('sequelize');
const db = require('../config/database');

const Cluster = db.define('clusters', {
    clustername: {
        type: Sequelize.STRING(20)
    },
    privlan: {
        type: Sequelize.INTEGER
    },
    secvlan: {
        type: Sequelize.INTEGER
    },
    tor1ip: {
        type: Sequelize.STRING(15)
    },
    tor2ip: {
        type: Sequelize.STRING(15)
    },
    interface: {
        type: Sequelize.STRING(8)
    }
 
})



Cluster.sync().then(() => {
    console.log('Table model for Clusters Synced');
    return Cluster
})


module.exports = Cluster
