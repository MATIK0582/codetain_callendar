// const express = require('express');
// const db = require('../config/dataBase');
// const usersAvaliableLeaves = require('../models/usersAvaliableLeavesConstructor');
// const usersLeaves = require('../models/usersLeaves');
// const Sequelize = require('sequelize');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay() - 1;
    if(firstDay === -1){
        firstDay = 6; 
    }
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }
            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);

                if (j === 5 || j === 6){
                    cell.classList.add("bg-success")
                }

                let id = "cell" + date + "_" + (month + 1) + "_" + year;
                let div = document.createElement("div");
                div.setAttribute("id", id);
                //div.classList.add("test");

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date

                // Pobierz informacje o userID i połącz z jego BD        req.session.userID --- express-sesion   
                // Znajdz urop w bazie danych dla aktualnego dnia        findAll i let{parametry}
                // Obhandluj jego parametry (dzien ,status itp.)         kolor w zależności od statusu itp.
                // div.appendChild(urlop);


                // const myJSON = axios.get('http://localhost:8000/calendar/leaves')
                // .then(function (response)
                // {
                //     console.log('dupa2');
                //     return response.data;
                    
                // })
                // .catch(function (error) 
                // {
                //     console.log("YYYYYYYYYY" , error);
                // });

                function getUser() {
                    try {
                        const response = axios.get('http://localhost:8000/calendar/leaves');
                        console.log(response);
                        return response;
                    } 
                    catch (error) {
                        console.error(error);
                    }
                }
                                
                const user = async () => {
                    const leaves = getUser()
                    .then(function(resp){
                        console.log(resp.data.users)
                        return resp.data.users;
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                }

                // function user() {
                //     try{
                //         leaves = getUser()
                //         console.log(leaves);
                //         return leaves.data.users;
                //     }
                //     catch(error){
                //         console.error(error);
                //     }
                // }


                let myJSON = user();
                console.log("XXX", myJSON);
                console.log(date);
                
                div.appendChild(cellText);
                cell.appendChild(div);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }

}