const inquirer = require('inquirer');
const inventoryTXN = require('./inventoryTXN');
const departmentInventory = require('./departmentInventory');
const cTable = require('console.table');
const CFonts = require('cfonts');
let prompts = require('./prompts');
const logo = require('./logo');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});

logo();
prompts.manCommand();

