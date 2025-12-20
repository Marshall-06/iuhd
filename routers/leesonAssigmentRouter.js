const express = require('express');
const router = express();
const leesonAssigmentController = require('../controllers/lessonAssigmentController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

router.post('/assign', authMiddleware, adminOnly, leesonAssigmentController.assignTeacher);
router.get('/all', authMiddleware, leesonAssigmentController.getAssignments);
router.get('/:id', authMiddleware, leesonAssigmentController.getAssignmentById);
router.put('/update/:id', authMiddleware, adminOnly, leesonAssigmentController.updateAssignment);
router.delete('/delete/:id', authMiddleware, adminOnly, leesonAssigmentController.deleteAssignment);
router.get('/group/:groupId', authMiddleware, leesonAssigmentController.getAssignmentsByGroup);

module.exports = router;