// Validation middleware - Pure JavaScript
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const validatedData = schema.parse(dataToValidate);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        // Format errors nicely for client
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};

// Validate query parameters
export const validateQuery = (schema) => validate(schema, "query");

// Validate URL params
export const validateParams = (schema) => validate(schema, "params");
