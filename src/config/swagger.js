const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const setupSwagger = (app) => {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "URL Shortener API",
        version: "1.0.0",
        description: "A simple API to shorten URLs",
      },
      basePath: "/",
    },
    apis: ["./src/controllers/*.js"],
  };

  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
