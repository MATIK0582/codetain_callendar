const express = require('express');
const session = require('express-session');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../config/dataBase');
const usersData = require('../models/usersDataConstructor');
const usersAvaliableLeaves = require('../models/usersAvaliableLeavesConstructor');
const usersLeaves = require('../models/usersLeaves');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Joi = require('@hapi/joi');

router.use(bodyParser.urlencoded({ extended: true }));

const schema = Joi.object().keys({
    name: Joi.string().alphanum(),
    secondName: Joi.string().alphanum(),
    login: Joi.string().alphanum(),
    password: Joi.string().alphanum(),
    checkPassword: Joi.string().alphanum(),
    mail: Joi.string().email({ minDomainSegments: 2 })
})

const FIFTEEN_MINUTES = 1000 * 60 * 15;

const {
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_LIFETIME = FIFTEEN_MINUTES,
    SESS_SECRET = 'area51l',
} = process.env

const IN_PROD = NODE_ENV === 'production'

router.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
    }
}))

const redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
        res.redirect('/login')
    }
    else{
        next()
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/calendar')
    }
    else{
        next()
    }
}

// const tmp = (usersData, res) =>{
//     if(usersData.dataValues.isAdmin === true){
//         usersLeaves.findAll({
//             where:{
//                 status: null
//             }
//         })
//         .then(leaves => res.render('renderLeaves', {leaves, usersData, defaultLayout: 'main' }))
//         .catch(err => console.log(err));
//     }
//     else{
//         res.render('hello', { defaultLayout: 'main' })  
//     }

// }

//Get data from userData table

const generateLeaves = (usersData) =>{
    let tmp = [];
    return usersData.findAll({})
    .then(usersData =>{
        for(let x=0;x<usersData.length;x++){
            usersLeaves.findAll({
                where:{
                    status: null,
                    userID: usersData[x].dataValues.id
                }
            })
            .then((leaves)=> {
                console.log("jestem tu:", x+1, "raz")
                // let tmp = [];
                tmp.push({
                    name: usersData[x].dataValues.name,
                    secondName: usersData[x].dataValues.secondName,
                    leaves
                });
                console.log(tmp.length);
                console.log(tmp);
                // if(x+1 === usersData.length){
                    return tmp;
                // }
                
            })
            .catch(err => console.log(err));
        }
        // console.log(tmp);
        // return tmp;
    })
    .catch(err => console.log(err));
}

router.get('/' ,redirectLogin ,(req, res) => {
    const { userID } = req.session
    
    return usersData.findOne({
        where:{
            id: req.session.userID
        }
    })
    .then(users=> {
        if(users.dataValues.isAdmin === true){
            generateLeaves(usersData)
            .then(tmp => {
                console.log(">>>>>>>>>>>>>pass<<<<<<<<<<<<<<<<");
                console.log("tmp: ",tmp)
                res.render('renderLeaves', {tmp, defaultLayout: 'main' });
            })
        }
        else{
            res.render('hello', { defaultLayout: 'main' })  
        }
    })
    .catch(err => console.log(err)) 
});

router.get('/calendar/leaves', (req, res)=> {
    return usersLeaves.findAll({
        where:{
            userID: req.session.userID
        }
    }).then((users)=> {
        res.send({ users });
    });  
});

router.get('/calendar/admin/leaves', (req, res)=> {
    return usersLeaves.findAll({})
    .then((users)=> {
        res.send({ users });
    });  
});

router.get('/user', (req, res)=> {
    return usersData.findAll({
        where:{
            id: req.session.userID
        }
    }).then((users)=> {
        res.send({ users });
    });  
});

router.get('/admin/users', (req, res)=> {
    return usersData.findAll({})
    .then((users)=> {
        res.send({ users });
    });  
});

//Dispaly calendar
router.get('/calendar' ,redirectLogin ,(req, res) =>{res.render('calendar')});

const generateLeaveView = (req, res, date, bool) =>{
    let slicedDate = [];
    slicedDate = date.split("-");
    // res.send(slicedDate);
    usersLeaves.findOne({
        where:{
            userID: req.session.userID,
            day: slicedDate[0],
            month: slicedDate[1],
            year: slicedDate[2]
        }
    })
    .then(leaveParams => {
        if(bool){
            res.render('adminLeaveView', {
                day: leaveParams.dataValues.day,
                month: leaveParams.dataValues.month,
                year: leaveParams.dataValues.year,
                description: leaveParams.dataValues.description,
                leaveType: leaveParams.dataValues.leaveType,
                status: leaveParams.dataValues.status,
                layout: 'main' 
            })
        }
        else if(bool === false){
            res.render('leaveView', {
                day: leaveParams.dataValues.day,
                month: leaveParams.dataValues.month,
                year: leaveParams.dataValues.year,
                description: leaveParams.dataValues.description,
                leaveType: leaveParams.dataValues.leaveType,
                status: leaveParams.dataValues.status,
                layout: 'main' 
            })
        }
        else{
            console.log("ERROR KRYTYCZNY")
        }
    })
    .catch(err => console.log(err));
}

router.get('/calendar/leave/:date' ,redirectLogin ,(req, res)=> {
    //console.log(req.params.date);
    usersData.findOne({
        where:{
            id: req.session.userID
        }
    })
    .then(usersData => {
        if(usersData.dataValues.isAdmin === true){
            // res.send("admin")
            generateLeaveView(req, res ,req.params.date, true);
        }
        else{
            generateLeaveView(req, res ,req.params.date, false);
        }
    })
    .catch(err => console.log(err))

    // res.send(req.params.date)
});

//Dispaly form to add leave
router.get('/calendar/addleave' ,redirectLogin ,(req, res) => res.render('add'));

router.get('/login' ,redirectHome , (req, res) => res.render('login', { layout: 'authenticate' }));

router.get('/register' ,redirectHome , (req, res) => res.render('register', { layout: 'authenticate' }));

//Add leave to userLeaves table
router.post('/calendar/addleave' ,redirectLogin ,(req, res) =>{

    let {day, month, year, description, leaveType, status} = req.body;
    
    if(leaveType === 'on')
    {
        leaveType = true;
    }
    else
    {
        leaveType = false;
    }

    if(leaveType == true)
    {
        status = true;
    }

    usersLeaves.create({
        userID: req.session.userID,
        day,
        month,
        year,
        description,
        leaveType,
        status
    })
    .then(res.redirect('/calendar'))
    .catch(err => console.log(err));
});


router.post('/login' ,redirectHome ,(req, res) => {

    let {login, password} = req.body;
    let errors = [];
    
    // crypt password

    usersData.findOne({
        where: {
            login
        }
    })
    .then(usersData => {
        console.log(usersData.dataValues.login);
        //TODO: Crypt password
        if(usersData.dataValues.login === login && usersData.dataValues.password === password){
            console.log("enter")
            req.session.userID = usersData.dataValues.id
            res.redirect('/calendar')
        }
        else{
            errors.push({ text: 'Niepoprawny login lub hasło'});
            res.render('login', { errors, layout: 'authenticate'});
        }
    })
    .catch(err => console.log(err))
});

router.post('/register' ,redirectHome ,(req, res) =>{

    let { name, secondName, login, password, checkPassword, mail} = req.body;
    let errors = [];
    
    const nameResult = Joi.validate({ name: name }, schema);
    if(nameResult.error !== null)
    {
        console.log("0");
        errors.push({ text: 'Niepoprawny format imienia'});
    }
    const secondNameResult = Joi.validate({ secondName: secondName }, schema);
    if(secondNameResult.error !== null)
    {
        console.log("1");
        errors.push({ text: 'Niepoprawny format nazwiska'});
    }
    const loginResult = Joi.validate({ login: login }, schema);
    if(loginResult.error !== null)
    {
        console.log("2");
        errors.push({ text: 'Niepoprawny format loginu'});
    }
    const passwordResult = Joi.validate({ password: password }, schema);
    if(passwordResult.error !== null)
    {
        console.log("3");
        errors.push({ text: 'Niepoprawny format hasła'});
    }
    const mailResult = Joi.validate({ mail: mail }, schema);
    if(mailResult.error !== null)
    {
        console.log("4");
        errors.push({ text: 'Niepoprawny format maila'});
    }

    if(password !== checkPassword)
    {
        console.log("5");
        errors.push({ text: 'Hasła są różne'});
    }

    const foo = login;
    usersData.findOne({
        where: {
            login: foo
        }
    })
    .then(buff => {
        if(buff === null)
        {
        }
        else
        {
            console.log("6");
            errors.push({ text: 'Nazwa użytkownika jest już zajęta'});
        }

        console.log(errors);

        if(errors.length > 0)
        {
            res.render('register', {
                errors
            });
        }
        else
        {
            usersData.create({
                name, 
                secondName, 
                login, 
                password, 
                checkPassword, 
                mail,
                isAdmin: false
            })
            .then(res.redirect('/calendar'))
            .catch(err => console.log(err));
            console.log("Wszystko spoko")
        }
    })
    .catch(err => console.log(err))
});

module.exports = router;