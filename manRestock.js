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

function manRestock(product, qty) { // add passed in qty to specified product
    connection.query(`SELECT prodQuantity, prodPrice FROM products WHERE prodName = "${product}"`, function (err, ans) {
        if (qty > 0) {
            connection.query('UPDATE products\r\nSET prodQuantity = prodQuantity + ' + parseInt(qty) + '\r\nWHERE prodName = "' + product + '";')
            console.log(`Stocking shelves....`)
            setTimeout(() => {
                logo();
                CFonts.say(`${product}`, options)
                inventoryTXN.onHand(product);
            }, 3000);
        } else {
            console.log(`\r\n**Quantity must be greater than 0 **\r\n`);
        }
    })
}

module.exports = manRestock;