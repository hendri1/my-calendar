import express from 'express';
import Connection from './src/helper/connection';
import userRouter from './src/controllers/userController';
import calendarRouter from './src/controllers/calendarController';

const app = express();
const port = 3000;
const version = '/v1';
const prefix = '/api' + version;

app.listen(port);
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`API listening on port ${port}!`);
});

app.use(prefix, userRouter);
app.use(prefix, calendarRouter);

module.exports = app;