const responseHandler = require("../middlewares/responseHandler");

describe("responseHandler", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("success", () => {
    it("should send a success response with the correct data", () => {
      const message = "Success";
      const data = { short_url: "http://short.ly/abc123" };
      const statusCode = 200;

      responseHandler.success(res, message, data, statusCode);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        status: statusCode,
        success: true,
        message,
        data,
      });
    });

    it("should use default values when parameters are not passed", () => {
      responseHandler.success(res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        message: "Success",
        data: {},
      });
    });
  });

  describe("error", () => {
    it("should send an error response with the correct message and details", () => {
      const message = "An unexpected error occurred";
      const statusCode = 400;
      const details = { error: "Invalid URL" };

      responseHandler.error(res, message, statusCode, details);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        status: statusCode,
        success: false,
        message,
        details,
      });
    });

    it("should use default values when parameters are not passed", () => {
      responseHandler.error(res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        success: false,
        message: "An unexpected error occurred",
        details: {},
      });
    });
  });
});
