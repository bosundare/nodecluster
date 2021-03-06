const Sequelize = require('sequelize');
const db = require('../config/database');
const Cluster = require('./cluster')

const Reservation = db.define('reservations', {
    // clustername: {
    //     type: Sequelize.STRING,
    //     reference: {
    //         model: Cluster,
    //         Key: "id"
    //     }
    // },
    extravlan: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    stopDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('applied','notapplied','error','complete'),
        allowNull: false,
        defaultValue: 'notapplied'

    },
})
Cluster.hasOne(Reservation, {
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
    }
})

Reservation.belongsTo(Cluster)
Reservation.sync().then(() => {
    console.log('Table model for Reservations Synced');
    
})

module.exports = Reservation