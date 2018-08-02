const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
const mysql = require('mysql');
const clear = require('clear');
const CFonts = require('cfonts');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});


let prompts = {
    selectCommand: function () {
        prompts.logo();
        inquirer.prompt([{
            type: 'list',
            message: 'Please choose what you would like to do: \r\n',
            choices: ['Order a product', 'Show all products', 'Filter products by Department'],
            name: 'command'
        }]).then(answers => {
            switch (answers.command) {
                case 'Order a product':
                    prompts.logo();
                    prompts.orderItem();
                    break;
                case 'Filter products by Department':
                    prompts.logo();
                    inventoryTXN.dispInventory();
                    break;
            
                default:
                    prompts.logo();
                    inventoryTXN.dispInventory();
                    break;
            }       
        });
    },
    logo: function () {
        clear();
        CFonts.say('Bamazon', {
            font: 'block', // define the font face
            align: 'center', // define text alignment
            colors: ['system'], // define all colors
            background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
            letterSpacing: 1, // define letter spacing
            lineHeight: 1, // define the line height
            space: true, // define if the output text should have empty lines on top and on the bottom
            maxLength: '0', // define how many character can be on one line
        });
    },
    orderPrompt: function (choices) {
        prompts.logo();
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