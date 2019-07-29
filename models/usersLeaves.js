const Sequelize = require('sequelize');
const db = require('../config/dataBase');

const usersLeave = db.define('usersLeave',{
    day:{
        type: Sequelize.INTEGER
    },
    month:{
        type: Sequelize.INTEGER
    },
    year:{
        type: Sequelize.INTEGER
    },
    description:{
        type: Sequelize.STRING
    },
    leaveType:{
        type: Sequelize.BOOLEAN
        // Value TRUE means it's leave on request,
        // so it's automatically accepted by system
    },
    status:{
        type: Sequelize.BOOLEAN
    }
})

module.exports = usersLeave;