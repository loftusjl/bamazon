const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
const cTable = require('console.table');
const CFonts = require('cfonts');
const logo = require('./logo');
let prompts = require('./prompts');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});


logo();
prompts.selectCommand();