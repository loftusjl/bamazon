const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
let prodArray = [];
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});


connectDB();
getOnHand();
listProducts();
listProductsOnly();



// FUNCTIONS
function connectDB(arguments) {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

    });
}

function listProductsOnly() {
    connection.query('select prodName from products;', function (error, results, fields) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            prodArray = results.map(a => a.prodName);
            inqProd(prodArray);
        }
    });
}

function inqProd(choices) {
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
    })
}

function prodRestock(prod) {
    connection.query('UPDATE products\r\nSET prodQuantity = ' + prod.qty + '\r\nWHERE prodName = "' + prod.prodName + '";')
}

function prodOnHand(prod) {
    connection.query('select prodName AS "Product Name", prodQuantity AS "On Hand Inv."\r\nfrom products\r\nwhere prodName = "' + prod.prodName + '"', function (error, results) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            const prodTable = cTable.getTable(results);
            console.log(`\r\nProduct QTY On-Hand:\r\n_____________________\r\n${prodTable}`);
            connection.end();
        }
    })
}
function getOnHand (arguments) {
    connection.query('select prodQuantity\r\nfrom products\r\nwhere prodName = "Pork - Caul Fat";', function (error, results) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            console.table(`Pork on hand: ${results.prodQuantity}`);
        }
    });
}

function listProducts() {
    connection.query('select prodID, prodName AS "Product Name", concat("$", format(prodPrice,2)) AS "Unit Price", prodQuantity AS Qty from products;', function (error, results) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            const prodTable = cTable.getTable(results);
            console.log(`\r\nProduct Inventory:\r\n${prodTable}`);
        }
    });
}