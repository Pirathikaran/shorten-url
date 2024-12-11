const responseHandler = {
  success: (res, message = "Success", data = {}, statusCode = 200) => {
    res.status(statusCode).json({
      status: statusCode,
      success: true,
      message,
      data,
    });
  },

  error: (
    res,
    message = "An unexpected error occurred",
    statusCode = 400,
    details = {}
  ) => {
    res.status(statusCode).json({
      status: statusCode,
      success: false,
      message,
      details,
    });
  },
};

module.exports = responseHandler;
