const { validationResult } = require("express-validator");
//  @dec  middleware for express validator
exports.validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
