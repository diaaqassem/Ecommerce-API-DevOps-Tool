//  @desc   this class is responsible about operation errors(that i can predict)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4)
      ? "Client error"
      : "Server error";
    this.isOperational = true;
  }
}

module.exports = ApiError;
