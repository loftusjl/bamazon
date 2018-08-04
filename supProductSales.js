const cTable = require('console.table');
const logo = require('./logo');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blanket',
    port: 3306,
    database: 'bamazon'
});

function supProductSales() {
    connection.query(`SELECT depID, depName AS Department, CONCAT("$",depOverhead) AS "Overhead Costs", CONCAT("$",SUM(prodsales)) AS "Product Sales", CONCAT("$",SUM(prodsales - depOverhead)) AS "Total Profit" FROM departments INNER JOIN products ON IDdep = depID GROUP BY depName;`,function (error, results) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            const prodTable = cTable.getTable(results);
            logo();
            console.log(`\r\n${prodTable}`);
        };
    });
}
module.exports = supProductSales;