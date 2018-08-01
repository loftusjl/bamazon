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
    setQty: function(prod) { // set onHand inventory to an exact number
        let query = connection.query('UPDATE products\r\nSET prodQuantity = ' + prod.qty + '\r\nWHERE prodName = "' + prod.prodName + '";')
    },
    buy: function(product, qty) {
        let tempQty = 0;
        let query = connection.query(`SELECT prodQuantity FROM products WHERE prodName = "${product}"`, function(err, ans) {
                tempQty = ans[0].prodQuantity - qty
        },
        function() {
            inventoryTXN.onHand(product);

        })
    },
    prodName: function() { // generate array of products for use in prompt selections
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
    onHand: function(prod) { // list single product and onHand inventory
        connection.query('select prodQuantity\r\nfrom products\r\nwhere prodName = "' + prod + '"', function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                // console.log(`onhand results`, results[0].prodQuantity);
                // return results[0].prodQuantity;
                const prodTable = cTable.getTable(results);
                console.log(`\r\nProduct QTY On-Hand:\r\n_____________________\r\n${prodTable}`);
                // database.end();
            }
        })
    },
    dispInventory: function() { // list full inventory
        connection.query('select prodID, prodName AS "Product Name", concat("$", format(prodPrice,2)) AS "Unit Price", prodQuantity AS Qty from products;', function (error, results) {
            if (error) {
                console.log(error)
                throw error;
            } else {
                const prodTable = cTable.getTable(results);
                console.log(`\r\nProduct Inventory:\r\n${prodTable}`);
            }
        });
    },
    connectDB: function() { // connect to database listed in connection parameters
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
    
        });
    }
}

module.exports = inventoryTXN;