import express from 'express';

const app = express();
import cors from 'cors';
import router from './router/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import fileStore from 'session-file-store';
// import swaggerUi from"swagger-ui-express";
// let swaggerDocument = require("./swagger.json");
import swaggerUi from 'swagger-ui-express';
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const swaggerDocument = require("./swagger.json") // use the require method
// import swaggerDocument from './swagger.json';
const FileStore = fileStore(session);

const port = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(
  cors({
    origin: [
      'https://petworld.github.io',
      'http://localhost:8080',
      'https://localhost:8080',
      'http://localhost:3030',
      'http://localhost:3031'
    ],
    credentials: true,
    exposedHeaders: ['set-cookie', 'X-Forwarded-Proto', 'Cookie'],
  })
);
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.set('trust proxy', 1);
app.use(
  session({
    name: 'user',
    secret: 'JasonChen',
    saveUninitialized: false,
    resave: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
      maxAge: 86400000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    store: new FileStore(),
  })
);
app.use('/api', router);
// api 文件

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.send('hello world ;)');
});

app.get('/auth', (req, res) => {
  if (req.session.userId) return res.send('authenticated');
  return res.send('not authenticated');
});

app.listen(port, () => {
  console.log('listening on port 3000..');
  // console.log(process.env.NODE_ENV === 'production');
});
