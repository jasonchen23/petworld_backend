import 'dotenv/config';
import mysql from 'mysql';

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: 'petworld',
});

export const queryUsers = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM user', (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const queryUser = (account) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM user WHERE account="${account}"`,
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

export const createUser = (account, password, email, phone, address, job, age) => {
  return new Promise((resolve, reject) => {
    // if(conn.query(`SELECT * FROM user WHERE email='${email}'`)== true){

    // }
    conn.query(
      `INSERT INTO user (account,password,email, phone, address, job, age) VALUES ('${account}','${password}','${email}','${phone}','${address}','${job}','${age}')`,
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

export const queryAnimals = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM animal order by 'animal_id' DESC`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const queryAnimal = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM animal WHERE animal_id= ${id}`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const queryAdopt = (userId,animalId) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO adopt (user_id,animal_id)
    VALUES ('${userId}','${animalId}')`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const viewAdopt = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM adopt WHERE user_id= ${id}`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const viewDonate = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM donate WHERE user_id= ${id}`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
export const queryDonate = (userId,dog,puppy,cat,kitty,shelter) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO donate (user_id,dog,puppy,cat,kitty,shelter)
    VALUES ('${userId}','${dog}','${puppy}','${cat}','${kitty}','${shelter}')`, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

// export const queryCart = (userId) => {
//   return new Promise((resolve, reject) => {
//     conn.query(
//       `SELECT * FROM cart WHERE user_id=${userId} AND order_id IS NULL`,
//       (error, result) => {
//         if (error) reject(error);
//         resolve(result);
//       }
//     );
//   });
// };

// const queryProductInCart = (userId, productId) => {
//   return new Promise((resolve, reject) => {
//     conn.query(
//       `SELECT * FROM cart WHERE user_id=${userId} AND product_id=${productId}`,
//       (error, result) => {
//         if (error) reject(error);
//         resolve(result);
//       }
//     );
//   });
// };

// export const addCart = (userId, productId, amount) => {
//   return new Promise((resolve, reject) => {
//     queryProductInCart(userId, productId)
//       .then((result) => {
//         if (result.length) {
//           conn.query(
//             `UPDATE cart SET amount=${amount} WHERE  user_id=${userId} AND product_id=${productId}`,
//             (error, result) => {
//               if (error) reject(error);
//               resolve(result);
//             }
//           );
//         } else {
//           conn.query(
//             `INSERT INTO cart (user_id,product_id,amount) VALUES (${userId},${productId},${amount})`,
//             (error, result) => {
//               if (error) reject(error);
//               resolve(result);
//             }
//           );
//         }
//       })
//       .catch((error) => reject(error));
//   });
// };
