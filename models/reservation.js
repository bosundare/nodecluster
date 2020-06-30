const Sequelize = require('sequelize');
const db = require('../config/database');
const Cluster = require('./cluster')

const Reservation = db.define('reservations', {
    // clustername: {
    //     type: Sequelize.STRING,
    //     reference: {
    //         model: Cluster,
    //         Key: "clustername"
    //     }
    // },
    extravlan: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.ENUM('applied','notapplied'),
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
Reservation.sync().then(() => {
    console.log('Table model for Reservations Synced');
})

module.exports = Reservation