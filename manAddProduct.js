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

function manAddProduct(product, price, qty, department) {
    let dep = 0;
    switch (department) {
        case 'Ankle Spice':
            dep = 1;
            break;
        case 'Salty Eats':
            dep = 2;
            break;
        case 'Terrible Treats':
            dep = 3;
            break;
        case 'Industrial Nutrition':
            dep = 4;
            break;
    
        default:
            dep = 5;
            break;
    } // Add a new product to the database
    connection.query(`INSERT INTO products (prodName, prodPrice, prodQuantity, IDdep) VALUES ("${product}",${price},${qty}, ${dep})`)
    logo();
    console.log(`${product} added.\r\n`)
    setTimeout(() => {
        CFonts.say(`${product}`,options);
        inventoryTXN.onHand(product);
    }, 2500);
}
module.exports = manAddProduct;