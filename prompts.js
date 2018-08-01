const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});

let prompts = {
    order: function(choices) {
        inquirer.prompt([{
            type: 'list',
            choices: choices,
            message: 'Select product: ',
            name: 'prodName'
        }, {
            type: 'input',
            message: 'Enter the new quantity on-hand:',
            name: 'qty'
        }]).then(answers => {
            prodRestock(answers)
            prodOnHand(answers)
        });
    },
    prodName: function () { // generate array of products for use in prompt selections
        connection.query('select prodName from products;', function (error, results, fields) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                let prodArray = [];
                prodArray = results.map(a => a.prodName);
                prompts.order(prodArray);
            }
        });
    },
}


module.exports = prompts;