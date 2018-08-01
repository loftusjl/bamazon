const mysql = require('mysql');
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
            let tempQty = ans[0].prodQuantity
            if (qty < tempQty) {
                connection.query('UPDATE products\r\nSET prodQuantity = prodQuantity - ' + qty + '\r\nWHERE prodName = "' + product + '";')
                console.log(`\r\nPurchase Order Summary: ${product}, ${qty}ea.\r\nTotal Cost: $${ans[0].prodPrice * qty}\r\n`)
            } else {
                console.log(`\r\n**Insufficient Stock**\r\n`);
                inventoryTXN.onHand(product);
            }
        })
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
    },
    addProduct: function (product, price, qty) {
        connection.query(`INSERT INTO products (prodName, prodPrice, prodQuantity) VALUES ("${product}",${price},${qty})`)
        console.log(`${product} added.\r\n`)
        inventoryTXN.onHand(product);
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
        let inventory = `select prodID, prodName AS "Product Name", concat("$", format(prodPrice,2)) AS "Unit Price", prodQuantity AS Qty from products`;
        if (typeof a != 'undefined') {
            inventory += ` WHERE prodQuantity < ${a}`
        };
        let query = connection.query(inventory, function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                const prodTable = cTable.getTable(results);
                console.log(`\r\nProduct Inventory:\r\n${prodTable}`);
            };
        });
    },
    connectDB: function () { // connect to database listed in connection parameters
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            // console.log('connected as id ' + connection.threadId);
        });
    }
}

module.exports = inventoryTXN;