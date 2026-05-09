const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { validateBody, validateQuery, addSchoolSchema, listSchoolsSchema } = require('../middleware/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     School:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - latitude
 *         - longitude
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the school
 *         address:
 *           type: string
 *           description: The physical address of the school
 *         latitude:
 *           type: number
 *           format: float
 *           description: Geographical latitude (-90 to 90)
 *         longitude:
 *           type: number
 *           format: float
 *           description: Geographical longitude (-180 to 180)
 */

/**
 * @swagger
 * /addSchool:
 *   post:
 *     summary: Add a new school to the database
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       201:
 *         description: School successfully added
 *       400:
 *         description: Validation failed (missing or invalid data)
 *       409:
 *         description: Conflict - School already exists
 *       500:
 *         description: Internal server error
 */
router.post('/addSchool', validateBody(addSchoolSchema), schoolController.addSchool);

/**
 * @swagger
 * /listSchools:
 *   get:
 *     summary: Get a list of schools sorted by proximity to the user
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: User's geographical latitude
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: User's geographical longitude
 *     responses:
 *       200:
 *         description: A list of schools successfully sorted by distance
 *       400:
 *         description: Validation failed (missing or invalid coordinates)
 *       500:
 *         description: Internal server error
 */
router.get('/listSchools', validateQuery(listSchoolsSchema), schoolController.listSchools);

module.exports = router;