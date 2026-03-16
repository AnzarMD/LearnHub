"use strict";
const { error } = require("../utils/response");

/**
 * Joi validation middleware.
 * @param {object} schema  - Joi schema
 * @param {string} property - "body" | "query" | "params"
 */
const validate = (schema, property = "body") => (req, res, next) => {
  const { error: err, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (err) {
    const errors = err.details.map((d) => ({
      field:   d.path.join("."),
      message: d.message.replace(/"/g, ""),
    }));
    return error(res, "Validation failed", 422, errors);
  }

  req[property] = value;
  next();
};

module.exports = validate;
