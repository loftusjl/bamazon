let inventoryTXN = require('./inventoryTXN');
let prompts = require('./prompts');

inventoryTXN.connectDB();
inventoryTXN.dispInventory(10);
inventoryTXN.addProduct('Tear Jerky', '6','2');