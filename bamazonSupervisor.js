const inquirer = require('inquirer');
const supProductSales = require('./supProductSales');
const inventoryTXN = require('./inventoryTXN');
const logo = require('./logo');

logo(); // clear terminal and display logo
supCommand();

function supCommand() {
    inquirer.prompt([{
        type: 'list',
        message: 'Please choose what you would like to do: \r\n',
        choices: ['View Product Sales by Department', 'Create New Department'],
        name: 'command'
    }]).then(answers => {
        switch (answers.command) {
            case 'Create New Department':
                logo();

                break;
            
            default:
                logo(); //! build department list generator
                // inquirer.prompt([
                //     {
                //         type: 'list',
                //         message: 'Select desired Department',
                //         choices: ['Ankle Spice', 'Salty Eats', 'Terrible Treats', 'Industrial Nutrition', 'Lyrical Grapefruit'],
                //         name: 'department'
                //     }
                // ]).then(answers => {
                // })
                supProductSales();
                break;
        }
    });
}