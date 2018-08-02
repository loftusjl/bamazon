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
    buy: function (product, qty) { // subtract passed in qty from specified product
        connection.query(`SELECT prodQuantity, prodPrice FROM products WHERE prodName = "${product}"`, function (err, ans) {
            let tempQty = ans[0].prodQuantity;
            let totalSale = ans[0].prodPrice * qty;
            if (qty < tempQty) {
                connection.query('UPDATE products\r\nSET prodQuantity = prodQuantity - ' + qty + '\r\nWHERE prodName = "' + product + '";')
                connection.query('UPDATE products\r\nSET prodSales = prodsales + ' + totalSale + '\r\nWHERE prodName = "' + product + '";')
                logo();
                console.log(`\r\nPurchase Order Summary: ${product}, ${qty}ea.\r\nTotal Cost: $${totalSale.toFixed(2)}\r\n`)
            } else {
                logo();
                console.log(`\r\n**Insufficient Stock**\r\n`);
                inventoryTXN.onHand(product);
            }
        })
        connection.end();
    },
    restock: function (product, qty) { // add passed in qty to specified product
        connection.query(`SELECT prodQuantity, prodPrice FROM products WHERE prodName = "${product}"`, function (err, ans) {
            if (qty > 0) {
                connection.query('UPDATE products\r\nSET prodQuantity = prodQuantity + ' + parseInt(qty) + '\r\nWHERE prodName = "' + product + '";')
                inventoryTXN.onHand(product);
            } else {
                console.log(`\r\n**Quantity must be greater than 0 **\r\n`);
            }
        })
        connection.end();
    },
    addProduct: function (product, price, qty, department) { // Add a new product to the database
        connection.query(`INSERT INTO products (prodName, prodPrice, prodQuantity, IDdep) VALUES ("${product}",${price},${qty}, ${department})`)
        console.log(`${product} added.\r\n`)
        inventoryTXN.onHand(product);
        connection.end();
    },
    onHand: function (prod) { // list single product and onHand inventory
        connection.query('select prodQuantity AS "On Hand Inventory"\r\nfrom products\r\nwhere prodName = "' + prod + '"', function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                const prodTable = cTable.getTable(results);
                console.log(`${prodTable}`);
            }
        })
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
        connection.end();
    },
    connectDB: function () { // connect to database listed in connection parameters
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            logo();
            // console.log('connected as id ' + connection.threadId);
        });
    }
}

module.exports = inventoryTXN;