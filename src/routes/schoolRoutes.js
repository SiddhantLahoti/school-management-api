const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { validateBody, validateQuery, addSchoolSchema, listSchoolsSchema } = require('../middleware/validate');

router.post('/addSchool', validateBody(addSchoolSchema), schoolController.addSchool);
router.get('/listSchools', validateQuery(listSchoolsSchema), schoolController.listSchools);

module.exports = router;