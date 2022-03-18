import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const port = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: ['http://localhost:8080', 'https://localhost:8080'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })
);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1);
app.use(
  session({
    name: 'user',
    secret: 'guava sleep',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 86400000 },
  })
);
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('hello world ;)');
});

app.listen(port, () => console.log('listening on port 5000..'));
