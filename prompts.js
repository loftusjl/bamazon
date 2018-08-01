const inquirer = require('inquirer');

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
    }
}


module.exports = prompts;