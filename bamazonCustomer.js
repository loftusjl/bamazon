let inventoryTXN = require('./inventoryTXN');
let prompts = require('./prompts');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});

inventoryTXN.connectDB();
inventoryTXN.dispInventory();
// console.log(`on hand`)
// inventoryTXN.onHand("Beef - Tongue, Fresh")