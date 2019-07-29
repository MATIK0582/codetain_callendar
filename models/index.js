const express = require('express');
const db = require('../config/dataBase');
const usersData = require('../models/usersDataConstructor');
const usersAvaliableLeaves = require('../models/usersAvaliableLeavesConstructor');
const usersLeaves = require('../models/usersLeaves');

module.exports = function (createDB) {

usersData.sync({ force: false }).then(() => {
    // return usersAvaliableLeaves.create({
    // });
});

// usersData.sync({ force: false }).then(() => {
//     return usersData.create({
//         login: 'admin',
//         name: 'Mateusz',
//         secondName: 'Topczewski',
//         password: 'test',
//         mail: 'test@test.com',
//         isAdmin: true
//     });
// });

usersData.hasMany(usersAvaliableLeaves, {
        foreignKey: 'userID',
        sourceKey: 'id'
});

usersAvaliableLeaves.sync({ force: false }).then(() => {
    // return usersAvaliableLeaves.create({
    // });
});

usersData.hasMany(usersLeaves, {
    foreignKey: 'userID',
    sourceKey: 'id'
});

usersLeaves.sync({ force: false }).then(() => {
    // return usersLeaves.create({
    // });
});
}