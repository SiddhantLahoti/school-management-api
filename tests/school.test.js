const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

// Mock the database pool to isolate API testing from the physical database
jest.mock('../src/config/db', () => ({
    execute: jest.fn()
}));

describe('School Management API Suite', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/addSchool', () => {
        it('should successfully add a school with valid data', async () => {
            // Mock DB response:
            // First call (SELECT for duplicate check) returns an empty array
            // Second call (INSERT) returns the new ID
            pool.execute
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([{ insertId: 42 }]);

            const response = await request(app)
                .post('/addSchool')
                .send({
                    name: "Don Bosco High School",
                    address: "Matunga, Mumbai",
                    latitude: 19.0269,
                    longitude: 72.8553
                });

            expect(response.status).toBe(201);
            expect(response.body.status).toBe("success");
            expect(response.body.data.id).toBe(42);
            expect(pool.execute).toHaveBeenCalledTimes(2);
        });

        it('should reject duplicate schools with a 409 status', async () => {
            // Mock DB response: SELECT finds an existing school
            pool.execute.mockResolvedValueOnce([[{ id: 1, name: "Don Bosco High School" }]]);

            const response = await request(app)
                .post('/addSchool')
                .send({
                    name: "Don Bosco High School",
                    address: "Matunga, Mumbai",
                    latitude: 19.0269,
                    longitude: 72.8553
                });

            expect(response.status).toBe(409);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toBe("A school with this name and address already exists");
            expect(pool.execute).toHaveBeenCalledTimes(1);
        });

        it('should reject requests with missing fields', async () => {
            const response = await request(app)
                .post('/addSchool')
                .send({
                    name: "Invalid School"
                    // Missing address, lat, lon
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should reject out-of-bound coordinates', async () => {
            const response = await request(app)
                .post('/addSchool')
                .send({
                    name: "Antarctica Academy",
                    address: "South Pole",
                    latitude: -120.0, // Invalid: latitude must be between -90 and 90
                    longitude: 85.0
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });
    });

    describe('GET /api/listSchools', () => {
        it('should return schools sorted by proximity to user coordinates', async () => {
            // Mock database returning raw, unsorted records
            const mockDbSchools = [
                { id: 1, name: "Far Away School", address: "Location A", latitude: 20.0, longitude: 73.0 },
                { id: 2, name: "Very Close School", address: "Location B", latitude: 19.1001, longitude: 72.8401 }
            ];
            pool.execute.mockResolvedValue([mockDbSchools]);

            // User is at Vile Parle, Mumbai (19.1075, 72.8370)
            const response = await request(app)
                .get('/api/listSchools')
                .query({ latitude: 19.1075, longitude: 72.8370 });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.count).toBe(2);

            // "Very Close School" must appear first in the sorted array
            expect(response.body.data[0].id).toBe(2);
            expect(response.body.data[1].id).toBe(1);
        });

        it('should fail if user latitude/longitude query params are missing', async () => {
            const response = await request(app)
                .get('/api/listSchools')
                .query({ latitude: 19.1075 }); // Missing longitude

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });
    });
});