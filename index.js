// require ('newrelic');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');
const { SitemapStream, streamToPromise } = require('sitemap');
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
const Product = require('./models/Product');
const Category = require('./models/Category');
const cors = require('cors');
app.use(cors());
app.use(compression());

// redirect to secure https://
// app.use((req, res, next) => {
//   if (req.header('x-forwarded-proto') !== 'https') {
//     res.redirect(`https://${req.header('host')}${req.url}`)
//   } else {
//     next();
//   }
// });

// redirect to main domain
// app.use((req, res, next) => {
//   if (req.hostname == 'hashingmart.herokuapp.com') {
//     res.redirect(`https://hashingmart.com${req.url}`)
//   } else {
//     next();
//   }
// });

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

let sitemap;
app.get('/sitemap.xml', async function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (sitemap) {
    res.send(sitemap)
    return;
  }

  try {
    const allProducts = await Product.find( {inStock: {$ne: false}} ).select('slug');
    const allCategories = await Category.find().select('slug');

    const products = allProducts.map( ({slug}) => `/product/${slug.toLowerCase()}`);
    const categories = allCategories.map( ({slug}) => `/products/${slug.toLowerCase()}` );

    const smStream = new SitemapStream( {hostname: 'https://hashingmart.com'} );
    const pipeline = smStream.pipe(createGzip());

    // Add each product URl to the stream
    products.forEach(function(item) {
      // Update as required
      smStream.write( {url: item, changefreq: 'daily', priority: 0.8} );
    });

    // Add each category URL to the stream
    categories.forEach(function(item) {
      // Update as required
      smStream.write( {url: item, changefreq: 'daily', priority: 0.8} );
    });

    // other pages
    smStream.write( {url: '/products', changefreq: 'daily', priority: 0.4} );
    smStream.write( {url: '/company', changefreq: 'weekly', priority: 0.4} );
    smStream.write( {url: '/contact', changefreq: 'weekly', priority: 0.4} );
    smStream.write( {url: '/faq', changefreq: 'weekly', priority: 0.4} );
    smStream.write( {url: '/shipping', changefreq: 'weekly', priority: 0.4} );
    smStream.write( {url: '/terms-of-use', changefreq: 'weekly', priority: 0.4} );
    smStream.write( {url: '/refunds', changefreq: 'weekly', priority: 0.4} );
    smStream.write( {url: '/privacy-policy', changefreq: 'weekly', priority: 0.4} );

    // cache response
    streamToPromise(pipeline).then(sm => sitemap = sm)
    smStream.end();

    // show errors and response
    pipeline.pipe(res).on('error', (e) => {throw e});
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
})

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