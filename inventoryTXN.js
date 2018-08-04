const mysql = require('mysql');
const logo = require('./logo');
const cTable = require('console.table');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});

let inventoryTXN = {
    onHand: function (prod) { // list single product and onHand inventory
        connection.query('select prodQuantity AS "On Hand Inventory"\r\nfrom products\r\nwhere prodName = "' + prod + '"', function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                const prodTable = cTable.getTable(results);
                console.log(`${prodTable}`);
            }
        });
    },
    dispInventory: function (a) { // list inventory. add Int to argument for inventory of items with less than listed qty on-hand
        let inventory = `select prodID, prodName AS "Product Name", depName AS "Department Name", concat("$", format(prodPrice,2)) AS "Unit Price", prodQuantity AS Qty from products INNER JOIN departments ON IDdep = depID`;
        if (a) {
            inventory += ` WHERE prodQuantity < ${a}`
        };
        let query = connection.query(inventory, function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                const prodTable = cTable.getTable(results);
                logo();
                console.log(`\r\n${prodTable}`);
            };
        });
    },
    endConnection: function() {
        setTimeout(() => {
            connection.end();
        }, 3000);
    }
}

module.exports = inventoryTXN;