const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
const departmentInventory = require('./departmentInventory');
let prodArray = [];
const cTable = require('console.table');
const CFonts = require('cfonts');
const logo = require('./logo');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});

logo(); // clear terminal and display logo
console.log(`Loading. Please wait....`)
// generate product list for prompts
connection.query('select prodName from products;', function (error, results, fields) {
    if (error) {
        console.log(error)
        throw error;
    } else {
        prodArray = results.map(a => a.prodName);
    }
});
setTimeout(() => {
    logo();
    selectCommand();
}, 5000);


function selectCommand() {
    inquirer.prompt([{
        type: 'list',
        message: 'Please choose what you would like to do: \r\n',
        choices: ['Order a product', 'Show all products', 'Show Department Products'],
        name: 'command'
    }]).then(answers => {
        switch (answers.command) {
            case 'Order a product':
                logo();
                
                orderPrompt();
                break;
            case 'Show Department Products':
                logo();
                departmentInventory();
                break;
            default:
                logo();
                inventoryTXN.dispInventory();
                break;
        }
    });
}
function buy(product, qty) { // subtract passed in qty from specified product
    connection.query(`SELECT prodQuantity, prodPrice FROM products WHERE prodName = "${product}"`, function (err, ans) {
        let tempQty = ans[0].prodQuantity;
        let totalSale = ans[0].prodPrice * qty;
        if (qty < tempQty) {
            connection.query('UPDATE products\r\nSET prodQuantity = prodQuantity - ' + qty + '\r\nWHERE prodName = "' + product + '";')
            connection.query('UPDATE products\r\nSET prodSales = prodsales + ' + totalSale + '\r\nWHERE prodName = "' + product + '";')
            logo();
            console.log(`\r\nPurchase Order Summary: ${product}, ${qty}ea.\r\nTotal Cost: $${totalSale.toFixed(2)}\r\n`)
        } else {
            logo();
            console.log(`\r\n**Insufficient Stock**\r\n`);
            inventoryTXN.onHand(product);
        }
    });
}
function orderPrompt() {
    
    logo();
    inquirer.prompt([{
        type: 'list',
        message: 'Welcome to the Customer Buy Module.\r\nPlease select a product: ',
        choices: prodArray,
        name: 'prodName'
    }, {
        type: 'input',
        message: 'Enter the quantity you wish to purchase:',
        name: 'qty'
    }]).then(answers => {
        buy(answers.prodName, answers.qty)
        selectCommand();
    });
}