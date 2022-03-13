import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  queryUsers,
  createUsers,
  queryProducts,
  queryProduct,
} from './db/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/api/products', async (req, res) => {
  const data = await queryProducts();
  res.send(data);
});

app.get('/api/products/:productId', async (req, res) => {
  try {
    const data = await queryProduct(req.params.productId);
    if (data.length) res.send(data);
    else throw new Error('no data');
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.get('/api/users', async (req, res) => {
  const data = await queryUsers();
  res.send(data);
});

app.post('/api/users', async (req, res) => {
  console.log(req.body);
  const result = await createUsers(req.body.account, req.body.password);
  res.send(result);
});

app.listen(port, () => console.log('listening on port 3000..'));
