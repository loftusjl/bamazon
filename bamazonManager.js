const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
const logo = require('./logo');
let prodArray = [];
const manAddProduct = require('./manAddProduct');
const manRestock = require('./manRestock');
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
setTimeout(() => { // allows time for prodArray to populate
    logo();
    manCommand();
}, 2500);

function manCommand() {
    inquirer.prompt([{
        type: 'list',
        message: 'Please choose what you would like to do: \r\n',
        choices: ['Show all products', 'Show Low Inventories', 'Restock Inventory', 'Add New Product'],
        name: 'command'
    }]).then(answers => {
        switch (answers.command) {
            case 'Show Low Inventories':
                logo();
                inquirer.prompt([{
                    type: 'input',
                    message: 'List inventories with less than how many on-hand?',
                    name: 'lowInventory'
                }]).then(ans => {
                    inventoryTXN.dispInventory(ans.lowInventory);
                })
                break;
            case 'Restock Inventory':
                logo();
                inquirer.prompt([{
                    type: 'list',
                    message: 'Select a product to restock: ',
                    choices: prodArray,
                    name: 'prodName'
                }, {
                    type: 'input',
                    message: 'Enter the quantity you are adding to the inventory:',
                    name: 'qty'
                }]).then(answers => {
                    let product = answers.prodName;
                    let qty = answers.qty
                    manRestock(product, qty);
                });
                break;
            case 'Add New Product':
                logo();
                inquirer.prompt([{
                    type: 'input',
                    message: 'Enter the new product name',
                    name: 'prodName'
                },{
                    type: 'input',
                    message: 'Input unit cost $',
                    name: 'price'
                }, {
                    type: 'input',
                    message: 'Input initial quantity',
                    name: 'qty'
                },{
                    type: 'list',
                    message: 'Enter Department product will be assigned to',
                    choices: ['Ankle Spice', 'Salty Eats', 'Terrible Treats', 'Industrial Nutrition', 'Lyrical Grapefruit'],
                    name: 'department'
                }
            ]).then(answers => {
                manAddProduct(answers.prodName,answers.price,answers.qty,answers.department);
            });
                break;
            default:
                logo();
                inventoryTXN.dispInventory();
                break;
        }
    });
}