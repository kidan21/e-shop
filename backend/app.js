const express = require('express');
const app = express();
require('dotenv/config');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const api = process.env.API_URL;
const db = process.env.CONNECTION_STRING;

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

mongoose.connect(db, {

}).then(() => {
    console.log("Database connection is ready");
}).catch((err) => {
    console.log(err);
})

app.listen(3000, () => {
    console.log(api);
    console.log('the server is running on 3000');
});