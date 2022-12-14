const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json('Token is not valid');
      req.user = user;
      next();
    })
  } else {
    return res.status(401).json('You are not authenticated');
  }
}

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that');
    }
  })
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
  // verifyToken(req, res, () => {
  //   User.findById(req.body.userId)
  //   .then(user => {
  //     if (!user) {
  //       res.status(404).json('Not found');
  //     }
  //     req.user = user;
  //     if (req.user.isAdmin) {
  //       next()
  //     } else {
  //       res.status(403).json('You are not allowed to do that!')
  //     }
  //     // console.log(req.user)
  //   })
    // console.log(req.user.isAdmin);
    // if (req.user.isAdmin) {
    //   next()
    // } else {
    //   res.status(403).json('You are not allowed to do that');
    // }
    // console.log(req.body)
  // })
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
}