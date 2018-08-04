const inquirer = require('inquirer');
const CFonts = require('cfonts');
const logo = require('./logo');
const cTable = require('console.table');
const mysql = require('mysql');
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
function departmentInventory() {
    inquirer.prompt([{
        type: 'list',
        choices: ['Ankle Spice', 'Salty Eats', 'Terrible Treats', 'Industrial Nutrition', 'Lyrical Grapefruit'],
        message: 'Select Department:\r\n',
        name: 'department'
    }]).then(dep => {
        logo();
        CFonts.say(`${dep.department} Department`, options)
        CFonts.say(`Inventory`, options)
        connection.query(`SELECT prodID, prodName AS "Product Name", concat("$", format(prodPrice,2)) AS "Unit Price", prodQuantity AS Qty FROM products INNER JOIN departments ON products.IDdep = departments.depID WHERE depName = "${dep.department}"`, function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                const prodTable = cTable.getTable(results);
                console.log(`\r\n${prodTable}`);
            };
        });
        connection.end();
    })
}

module.exports = departmentInventory;