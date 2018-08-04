const mysql = require('mysql');
const inventoryTXN = require('./inventoryTXN');
const logo = require('./logo');
const CFonts = require('cfonts');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});
const options = {
    font: 'chrome', // define the font face
    align: 'center', // define text alignment
    colors: ['gray', 'green', 'blue'], // define all colors
    background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 1, // define the line height
    space: false, // define if the output text should have empty lines on top and on the bottom
    maxLength: '0', // define how many character can be on one line
}

function supCreateDepartment(department, overhead) {
    connection.query(`INSERT INTO departments (depName, depOverhead) VALUES ("${department}",${overhead})`)
    logo();
    console.log(`${department} added.\r\n`)
}
module.exports = supCreateDepartment;