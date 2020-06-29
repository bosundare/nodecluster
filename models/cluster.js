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

const Reservation = db.define('reservations', {
    // clusterid: {
    //     type: Sequelize.INTEGER,
    //     reference: {
    //         model: Cluster,
    //         Key: "id"
    //     }
    // },
    extravlan: {
        type: Sequelize.INTEGER
    },
    startDate: {
        type: Sequelize.DATE
    },
    stopDate: {
        type: Sequelize.DATE
    },
    status: {
        type: Sequelize.ENUM('applied','notapplied')
    },
})

Cluster.hasOne(Reservation)


Cluster.sync().then(() => {
    console.log('Table model for Clusters Synced');
})

Reservation.belongsTo(Cluster)
Reservation.sync().then(() => {
    console.log('Table model for Reservations Synced');
})
module.exports = Cluster
