const inquirer = require('inquirer');
const supProductSales = require('./supProductSales');
const supCreateDepartment = require('./supCreateDepartment');
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
                inquirer.prompt([
                    {
                        type: 'input',
                        message:'What is the new Department name?',
                        name: 'dep',
                    },{
                        type: 'input',
                        message:'What is the overhead cost? $',
                        name: 'overhead'
                    }
                ]).then(answers => {
                    supCreateDepartment(answers.dep, answers.overhead);
                })
                break;
            
            default:
                logo();
                supProductSales();
                break;
        }
    });
}