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
  res.send(data);
});

router.route('/products/:productId').get(async (req, res) => {
  try {
    const data = await queryProduct(req.params.productId);
    if (data.length) {
      res.send(data);
      return true;
    } else throw new Error('no data');
  } catch (err) {
    res.status(500).json({
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
        return res
          .status(400)
          .json({ status: 'error', message: errors.array() });
      }
      try {
        //檢查重複帳號
        const existUser = await queryUser(req.body.account);
        if (existUser.length) {
          res.status(400).json({
            status: 'error',
            message: 'user already exists',
          });
          return true;
        }

        //建立使用者
        await createUser(
          req.body.account,
          bcrypt.hashSync(req.body.password, 10),
          req.body.email,
          req.body.fullName
        );
        res.json({
          status: 'success',
          message: 'create user',
        });
      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: 'cannot insert user',
        });
      }
    }
  );

export default router;
