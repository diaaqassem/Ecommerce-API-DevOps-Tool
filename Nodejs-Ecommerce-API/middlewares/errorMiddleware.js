const SendErrForDevMode = (err, res) => {
  res.status(400).json({
    path: err.path,
    Message: err.message,
    StatusCode: err.statusCode,
    Status: err.status,
    Error: err,
    stack: err.stack,
  });
};

const SendErrForProdMode = (err, res) => {
  res.status(400).json({
    Message: err.message,
    Status: err.status,
  });
};

exports.globalError = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    SendErrForDevMode(err, res);
  } else {
    // handle incorrect token
    if (err.name === "JsonWebTokenError") {
      err.message = "Invalid token , please try again with a valid token";
      err.status = "fail";
    }
    // handle expired token
    if (err.name === "TokenExpiredError") {
      err.message = "expired token , please try again with a valid token";
      err.status = "fail";
    }
    SendErrForProdMode(err, res);
  }
};
