const Sequelize = require('sequelize');
const db = require('../config/dataBase');

const usersAvaliableLeaves = db.define('usersAvaliableLeaves',{
    leaves:{
        type: Sequelize.INTEGER
    },
    leavesAtRequest:{
        type: Sequelize.INTEGER
    }
})

module.exports = usersAvaliableLeaves;