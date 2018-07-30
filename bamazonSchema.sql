DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

-- build products table
DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products(prodID INT AUTO_INCREMENT NOT NULL, prodName VARCHAR(60) NOT NULL, prodPrice DECIMAL(18,2), prodQuantity INT, IDdep INT, PRIMARY KEY(prodID));

-- build departments table
DROP TABLE IF EXISTS departments;

CREATE TABLE IF NOT EXISTS departments(depID INT AUTO_INCREMENT NOT NULL, depName VARCHAR(60) NOT NULL, depOverhead DECIMAL(18,2), PRIMARY KEY(depID));