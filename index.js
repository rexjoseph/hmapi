const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');
const { createGzip } = require('zlib');
dotenv.config();
app.use(express.json());
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const emailRoute = require('./routes/email');
const categoryRoute = require('./routes/category');
const socialRoute = require('./routes/social');
const bannerRoute = require('./routes/banner');
const authorizeRoute = require('./routes/authorize');
const cors = require('cors');
app.use(cors());
app.use(compression());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/email', emailRoute)
app.use('/api/category', categoryRoute);
app.use('/api/social', socialRoute);
app.use('/api/banner', bannerRoute);
app.use('/api/checkout', authorizeRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('DB Connected'))
.catch((err) => {
  console.log(err)
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

app.listen(process.env.PORT || 4000, () => {
  console.log('Server running!');
})