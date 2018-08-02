const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
const departmentInventory = require('./departmentInventory');
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


let prompts = {
    selectCommand: function () {
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
                    departmentInventory();
                    break;
                case 'Add New Product':
                    logo();
                    departmentInventory();
                    break;
                default:
                    logo();
                    inventoryTXN.dispInventory();
                    break;
            }
        });
    },

    orderPrompt: function (choices) {
        logo();
        inquirer.prompt([{
            type: 'list',
            choices: choices,
            message: 'Welcome to the Customer Buy Module.\r\nPlease select a product: ',
            name: 'prodName'
        }, {
            type: 'input',
            message: 'Enter the quantity you wish to purchase:',
            name: 'qty'
        }]).then(answers => {
            inventoryTXN.buy(answers.prodName, answers.qty)
            prompts.selectCommand();
        });
    },
    orderItem: function () { // generate array of products for use in ordering
        connection.query('select prodName from products;', function (error, results, fields) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                let prodArray = [];
                prodArray = results.map(a => a.prodName);
                prompts.orderPrompt(prodArray);
            }
        });
    },
}
logo();
prompts.selectCommand();

