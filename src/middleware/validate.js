const { z } = require('zod');

// Helper to safely transform and validate coordinates
const coordinateValidator = (requiredMsg, min, max, type) => z.any()
    .transform((val) => {
        // Treat undefined, null, or empty strings as missing values
        if (val === undefined || val === null || val === '') return undefined;
        // Otherwise coerce to a number
        return Number(val);
    })
    .superRefine((val, ctx) => {
        if (val === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredMsg
            });
            return; // Stop further validation for this field
        }
        if (isNaN(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${type} must be a valid number`
            });
            return;
        }
        if (val < min || val > max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${type} must be between ${min} and ${max}`
            });
        }
    });

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

    latitude: coordinateValidator("Latitude is required", -90, 90, "Latitude"),
    longitude: coordinateValidator("Longitude is required", -180, 180, "Longitude")
});

// Schema for listing schools (GET /listSchools)
const listSchoolsSchema = z.object({
    latitude: coordinateValidator("User latitude is required to calculate proximity", -90, 90, "Latitude"),
    longitude: coordinateValidator("User longitude is required to calculate proximity", -180, 180, "Longitude")
});

// Middleware wrappers
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: result.error.issues.map(err => ({
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
            errors: result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }
    req.query = result.data;
    next();
};

module.exports = { validateBody, validateQuery, addSchoolSchema, listSchoolsSchema };