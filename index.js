import express from 'express';
import cors from 'cors';
import router from './router/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import fileStore from 'session-file-store';
const FileStore = fileStore(session);

const port = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: [
      'https://fn101-final-project.github.io',
      'http://localhost:8080',
      'https://localhost:8080',
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
    name: 'userId',
    secret: 'guava sleep',
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

app.get('/', (req, res) => {
  res.send('hello world ;)');
});

app.get('/auth', (req, res) => {
  if (req.session.userId) return res.send('authenticated');
  return res.send('not authenticated');
});

app.listen(port, () => {
  console.log('listening on port 5000..');
  console.log(process.env.NODE_ENV === 'production');
});
