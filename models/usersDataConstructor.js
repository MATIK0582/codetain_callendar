const Sequelize = require('sequelize');
const db = require('../config/dataBase');

const usersData = db.define('usersData',{
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING
    },
    secondName:{
        type: Sequelize.STRING
    },
    login:{
        type: Sequelize.STRING
    },
    password:{
        type: Sequelize.STRING
    },
    mail:{
        type: Sequelize.STRING
    },
    isAdmin:{
        type: Sequelize.BOOLEAN
    }
})

module.exports = usersData;