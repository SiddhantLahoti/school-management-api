const { z } = require('zod');

// Schema for adding a school (POST /addSchool)
const addSchoolSchema = z.object({
    name: z.string({
        required_error: "School name is required",
        invalid_type_error: "School name must be a string"
    }).trim().min(1, "School name cannot be empty"),

    address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string"
    }).trim().min(1, "Address cannot be empty"),

    // Using coerce to safely convert string inputs (from forms) to numbers
    latitude: z.coerce.number({
        required_error: "Latitude is required",
        invalid_type_error: "Latitude must be a valid number"
    }).min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90"),

    longitude: z.coerce.number({
        required_error: "Longitude is required",
        invalid_type_error: "Longitude must be a valid number"
    }).min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180")
});

// Schema for listing schools (GET /listSchools)
const listSchoolsSchema = z.object({
    latitude: z.coerce.number({
        required_error: "User latitude is required to calculate proximity",
        invalid_type_error: "Latitude must be a valid number"
    }).min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90"),

    longitude: z.coerce.number({
        required_error: "User longitude is required to calculate proximity",
        invalid_type_error: "Longitude must be a valid number"
    }).min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180")
});

// Middleware wrappers
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }
    req.body = result.data; // Assign cleaned/parsed data
    next();
};

const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }
    req.query = result.data;
    next();
};

module.exports = { validateBody, validateQuery, addSchoolSchema, listSchoolsSchema };