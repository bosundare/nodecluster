const Sequelize = require('sequelize');
const db = require('../config/database');

const Users = db.define('users', {
    username: {
        type: Sequelize.STRING(20)
    },
    password: {
        type: Sequelize.STRING(255)
    }
})
Users.sync().then(() => {
    console.log('Table model for Users Synced');
})
module.exports = Users