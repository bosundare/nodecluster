const Sequelize = require('sequelize');
const db = require('../config/database');

const Cluster = db.define('cluster', {
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
module.exports = Cluster