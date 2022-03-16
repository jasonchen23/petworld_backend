import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('hello world ;)');
});

app.listen(port, () => console.log('listening on port 5000..'));
