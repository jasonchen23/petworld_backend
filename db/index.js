import 'dotenv/config';
import mysql from 'mysql';

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: 'shopping_cart',
});

export const queryUsers = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM users', (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const createUsers = (account, password) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO users (account, password) VALUES ('${account}','${password}')`,
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

export const queryProducts = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM products', (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const queryProduct = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM products WHERE id=${id}`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
