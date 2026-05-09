module.exports = (err, req, res, next) => {
    console.error(err.stack);

    // Check for specific DB errors if needed
    if (err.code === 'ECONNREFUSED') {
        return res.status(500).json({ status: "error", message: "Database connection failed." });
    }

    return res.status(500).json({
        status: "error",
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
};