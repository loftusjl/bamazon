const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'blanket',
  port: 3306,
  database: 'bamazon'
});
 

connectDB();
listProducts();



// FUNCTIONS
function connectDB (arguments) {
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
       
        console.log('connected as id ' + connection.threadId);
      });
}

function listProducts () {
    connection.query('select prodID, prodName AS "Product Name", concat("$", format(prodPrice,2)) AS "Unit Price", prodQuantity AS Qty from products;', function (error, results, fields) {
      if (error) {
        console.log(error)  
        throw error;
        }
      else {
          const prodTable = cTable.getTable(results);
          console.table(prodTable);
    
      }
    });
}
 
connection.end();