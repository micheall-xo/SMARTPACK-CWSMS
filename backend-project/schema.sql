CREATE DATABASE IF NOT EXISTS CWSMS;
USE CWSMS;

CREATE TABLE IF NOT EXISTS packages (
  package_number INT AUTO_INCREMENT PRIMARY KEY,
  package_name VARCHAR(100) NOT NULL,
  package_description VARCHAR(255) NOT NULL,
  package_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS cars (
  plate_number VARCHAR(20) PRIMARY KEY,
  car_type VARCHAR(50) NOT NULL,
  car_size VARCHAR(50) NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  payment_number INT AUTO_INCREMENT PRIMARY KEY,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS service_records (
  record_number INT AUTO_INCREMENT PRIMARY KEY,
  service_date DATE NOT NULL,
  plate_number VARCHAR(20) NOT NULL,
  package_number INT NOT NULL,
  payment_number INT NULL,
  CONSTRAINT fk_service_car FOREIGN KEY (plate_number) REFERENCES cars(plate_number),
  CONSTRAINT fk_service_package FOREIGN KEY (package_number) REFERENCES packages(package_number),
  CONSTRAINT fk_service_payment FOREIGN KEY (payment_number) REFERENCES payments(payment_number)
);

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

INSERT INTO packages (package_name, package_description, package_price)
VALUES
  ('Basic wash','Exterior hand wash',5000),
  ('Classic wash','Interior hand wash',10000),
  ('Premium wash','Exterior and Interior hand wash',20000)
ON DUPLICATE KEY UPDATE package_name=VALUES(package_name);
