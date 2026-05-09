const pool = require('../config/db');

exports.addSchool = async (req, res, next) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        // 1. Check if a school with the exact same name and address already exists
        const [existingSchool] = await pool.execute(
            'SELECT id FROM schools WHERE name = ? AND address = ?',
            [name, address]
        );

        if (existingSchool.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "A school with this name and address already exists"
            });
        }

        // 2. Insert the school if it does not exist
        const [result] = await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );

        return res.status(201).json({
            status: "success",
            message: "School added successfully",
            data: { id: result.insertId, name, address, latitude, longitude }
        });
    } catch (error) {
        next(error); // Forward to global error handler
    }
};

exports.listSchools = async (req, res, next) => {
    try {
        const { latitude: userLat, longitude: userLon } = req.query;

        // Use the Haversine formula directly in the SQL query
        // This calculates distance in kilometers and sorts by it directly in the database
        const query = `
            SELECT id, name, address, latitude, longitude,
            ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) 
            * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) 
            * sin( radians( latitude ) ) ) ) AS distance 
            FROM schools 
            ORDER BY distance ASC
        `;

        // The query requires 3 parameters: userLat, userLon, userLat
        const [schools] = await pool.execute(query, [userLat, userLon, userLat]);

        // Format distance to 2 decimal places for cleaner output
        const formattedSchools = schools.map(school => ({
            ...school,
            distance: parseFloat(school.distance.toFixed(2))
        }));

        return res.status(200).json({
            status: "success",
            count: formattedSchools.length,
            data: formattedSchools
        });
    } catch (error) {
        next(error);
    }
};
