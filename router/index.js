import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import {
  queryUser,
  createUser,
  queryAnimals,
  queryAnimal,
  queryAdopt,
  queryDonate,
  viewAdopt,
  viewDonate,
  queryUsers
  // addCart,
  // queryCart,
} from '../db/index.js';

const router = express.Router();

router.route('/animal').get(async (req, res) => {
  const data = await queryAnimals();
  return res.send(data);
});

router.route('/animal/:animalId').get(async (req, res) => {
  try {
    const data = await queryAnimal(req.params.animalId);
    if (data.length) return res.send(data);
    else throw new Error('no data');
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});
router.route('/animal/:animalId/adopt').post(async (req, res) => {
  try {
    const data = await queryAdopt(req.body.userId,req.params.animalId);
    return res.json({
      status: 'success',
      message: 'Adopt success',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});
router.route('/donate').post(async (req, res) => {
  try {
    const data = await queryDonate(
      req.body.userId,
      req.body.dog,
      req.body.puppy,
      req.body.cat,
      req.body.kitty,
      req.body.shelter
    );
    return res.json({
      status: 'success',
      message: 'donate success',
    });
  }catch(err) {
    return res.status(500).json({
      status:'error',
      message: 'id not donate'
    })
  }
});
router
  .route('/users')
  .get(async (req, res) => {
    const data = await queryUsers();
    return res.send(data);
  });

router.route('/users/create')
  .post(
    [
      body('account').exists().withMessage('帳號必填'),
      body('password')
        .exists()
        .withMessage('密碼必填')
        .trim()
        .isLength({ min: 8 })
        .withMessage('密碼字數不夠'),
      body('email')
        .exists()
        .withMessage('Email必填')
        .isEmail()
        .withMessage('Email格式不符'),
      body('phone').exists().withMessage('電話必填'),
      body('address').exists().withMessage('地址必填'),
      body('job').exists().withMessage('職業必填'),
      body('age').exists().withMessage('年齡必填'),
    ],
    async (req, res) => {
      //欄位驗證
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: errors.array(),
        });
      }
      try {
        //檢查重複帳號
        const existUser = await queryUser(req.body.account);
        if (existUser.length) {
          return res.status(400).json({
            status: 'error',
            message: 'user already exists',
          });
        }

        //建立使用者
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        await createUser(
          req.body.account,
          hashPassword,
          req.body.email,
          req.body.phone,
          req.body.address,
          req.body.job,
          req.body.age
        );
        return res.json({
          status: 'success',
          message: 'create user',
        });
      } catch (err) {
        return res.status(500).json({
          status: 'error',
          message: 'cannot insert user',
        });
      }
    }
  );

router.route('/users/login').post(async (req, res) => {
  const user = await queryUser(req.body.account);
  //沒帳號
  if (!user.length) {
    return res.status(400).json({
      status: 'error',
      message: 'user not exists',
    });
  }
  //密碼錯誤
  const userPassword = await bcrypt.compare(
    req.body.password,
    user[0].password
  );
  if (!userPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'password incorrect',
    });
  } else {
    req.session.userId = user[0].userId;
    return res.json({
      status: 'success',
      data: {
        userName: user[0].account,
      },
    });
  }
});

router.route('/users/logout').get((req, res) => {
  req.session.destroy(() => {
    res.clearCookie('userId', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.send('logout');
  });
});

router.route('/users/viewadopt').post(async (req, res) => {
  try {
    const data = await viewAdopt(req.body.userId);
    return res.send(data);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});
  router
  .route('/users/viewDonate')
  .post(async (req, res) => {
    try {
      const data = await viewDonate(req.body.userId);
      return res.send(data);
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err.message,
      });
    }
  });
// router
//   .route('/cart')
//   .get(async (req, res) => {
//     try {
//       const cart = await queryCart(req.session.userId);
//       return res.json({
//         status: 'success',
//         data: cart,
//       });
//     } catch (err) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'cannot query cart',
//       });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       await Promise.all(
//         req.body.cart.map((product) => {
//           return addCart(
//             req.session.userId,
//             product.product_id,
//             product.amount
//           );
//         })
//       );
//       return res.json({
//         status: 'success',
//         message: 'cart inserted',
//       });
//     } catch (err) {
//       return res.status(500).json({
//         status: 'error',
//         massage: 'cannot insert cart',
//       });
//     }
//   });

export default router;
