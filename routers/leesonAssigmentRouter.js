const express = require('express');
const router = express();
const leesonAssigmentController = require('../controllers/lessonAssigmentController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

router.post('/assign',  leesonAssigmentController.assignTeacher);
router.post("/assign/multiple", leesonAssigmentController.assignTeacherToMultipleGroups )
router.get('/all',  leesonAssigmentController.getAssignments);
router.get('/:id', leesonAssigmentController.getAssignmentById);
router.put('/update/:id',  leesonAssigmentController.updateAssignment);
router.delete('/delete/:id',  leesonAssigmentController.deleteAssignment);
router.get('/group/:groupId',  leesonAssigmentController.getAssignmentsByGroup);
router.get('/teacher/:teacherId',  leesonAssigmentController.getAssignmentByTeacher);

module.exports = router;