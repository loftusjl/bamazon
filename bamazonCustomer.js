const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
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
            choices: ['Order a product', 'Show all products', 'Filter products by Department'],
            name: 'command'
        }]).then(answers => {
            switch (answers.command) {
                case 'Order a product':
                    logo();
                    prompts.orderItem();
                    break;
                case 'Filter products by Department':
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


function departmentInventory() {
    inquirer.prompt([{
        type: 'list',
        choices: ['Sports','Tools','Industrial','Music','Kids'],
        message: 'Select Department:\r\n',
        name: 'department'
    }]).then(dep => {
        logo();
        let options = {
            font: 'chrome', // define the font face
            align: 'center', // define text alignment
            colors: ['gray','green','blue'], // define all colors
            background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
            letterSpacing: 1, // define letter spacing
            lineHeight: 1, // define the line height
            space: false, // define if the output text should have empty lines on top and on the bottom
            maxLength: '0', // define how many character can be on one line
        }
        CFonts.say(`${dep.department} Department`,options)
        CFonts.say(`Inventory`,options)
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