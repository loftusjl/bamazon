use bamazon;

select prodID, prodName, concat("$", format(prodPrice,2)), prodQuantity from products;

update products
set prodQuantity = 
where prodName = 