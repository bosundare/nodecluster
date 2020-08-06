const Sequelize = require('sequelize');
const db = require('../config/database');
const Cluster = require('./cluster')

const Alert = db.define('alerts', {
    // clustername: {
    //     type: Sequelize.STRING,
    //     reference: {
    //         model: Cluster,
    //         Key: "id"
    //     }
    // },
    totalalerts: {
        type: Sequelize.INTEGER(),
        allowNull: false,
        defaultValue: '0'
    },
    status: {
        type: Sequelize.ENUM('checked','unchecked','autherror','unreachable'),
        allowNull: false,
        defaultValue: 'unchecked'
    },
    alerts: {
        type: Sequelize.STRING(2000),
        allowNull: false,
        defaultValue: 'none'
    },
})
Cluster.hasOne(Alert, {
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
    }
})

Alert.belongsTo(Cluster)
Alert.sync().then(() => {
    console.log('Table model for Alerts Synced');
    
})

module.exports = Alert