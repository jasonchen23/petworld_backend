import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import {
  queryUser,
  createUser,
  queryProducts,
  queryProduct,
} from '../db/index.js';

const router = express.Router();

router.route('/products').get(async (req, res) => {
  const data = await queryProducts();
  return res.send(data);
});

router.route('/products/:productId').get(async (req, res) => {
  try {
    const data = await queryProduct(req.params.productId);
    if (data.length) return res.send(data);
    else throw new Error('no data');
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'cannot query product',
    });
  }
});

router
  .route('/users')
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
      body('fullName').exists().withMessage('用戶名必填'),
    ],
    async (req, res) => {
      //欄位驗證
      const errors = validationResult(req);
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
          req.body.fullName
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
    req.session.userId = user[0].id;
    return res.json({
      status: 'success',
      data: {
        userName: user[0].full_name,
      },
    });
  }
});

router.route('/users/logout').get((req, res) => {
  req.session.destroy(() => {
    res.clearCookie('userId');
    return res.send('logout');
  });
});

export default router;
