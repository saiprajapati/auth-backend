const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const{
    createTask,
    getMyTasks,
    updateTasks,
    delteTasks,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/", getMyTasks);
router.put("/:id", updateTasks);
router.delete("/:id", deleteTask);

module.exports = router;