/** Middleware for handling req authorization for routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const ExpressError = require("../helpers/expressError");

/** Authorization Middleware: Requires user is logged in. */

function requireLogin(req, res, next) {
  try {
    if (!req.curr_username) {
      // User is not authenticated, set the response status to 401 and send an error message
      res.status(401).json({ error: 'Not authenticated' });
  }
   else {
      // User is authenticated, proceed to the next middleware
      return next();
    }
  } catch (err) {
    // An unexpected error occurred, pass it to the next middleware
    return next(err);
  }
}


/** Authorization Middleware: Requires user is logged in and is staff. */

function requireAdmin(req, res, next) {
  try {
    if (req.curr_admin) {
      return next();
    } else {
      return next({ status: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    return next(err);
  }
}

/** Authentication Middleware: put user on request
 *
 * If there is a token, verify it, get payload (username/admin),
 * and store the username/admin on the request, so other middleware/routes
 * can use it.
 *
 * It's fine if there's no token---if not, don't set anything on the
 * request.
 *
 * If the token is invalid, an error will be raised.
 *
 **/

function authUser(req, res, next) {
  try {
    const token = req.body._token || req.query._token;
    if (!token) {
      return next(new ExpressError('No token provided', 401));
    }

    let payload = jwt.decode(token);
    if (!payload) {
      return next(new ExpressError('Failed to decode token', 401));
    }

    req.curr_username = payload.username;
    req.curr_admin = payload.admin;
    return next();
    
  } catch (err) {
    return next(err);
  }
}

 // end

module.exports = {
  requireLogin,
  requireAdmin,
  authUser
};
