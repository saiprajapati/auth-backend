const Task = require("../models/Task");
const AppError = require("../utils/AppError");

// Create Task
const createTask = async (req, res, next) => {
    try{
        const{ title, description } = req.body;

        if(!title){
            return next(new AppError("Title is required", 400));
        }

        const task = await Task.create({
            title,
            description,
            user: req.user._id
        });

        res.status(201).json({
            status: "success",
            data: task
        });
    } catch(error) {
        next(error);
    }
};

// GET Users Tasks

const getMyTasks = async (req, res, next) => {
    try{
        const tasks = await Task.find({user: req.user._id});

        res.status(200).json({
            status: "Success",
            results: tasks.length,
            data : tasks
        });
    } catch (error) {
        next(error);
    }
};

// Update Task
const updateTasks = async (req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task){
            return next(new AppError("Task not found", 404));
        }

        // Ownership Check
        if (task.user.toString() != req.user._id.toString()){
            return next(new AppError("Unathorized Access", 403));
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;

        await task.save()

        res.status(200).json({
            message: "Update Successful",
            data: task
        }); 
    } catch (error) {
        next(error);
    }
};

// Delete Task
const deleteTask = async (req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task){
            return next(new AppError("Task not found", 404));
        }

        if(task.user.toString() !== req.user._id.toString()){
            return next(new AppError("Not authorized", 403));
        }

        await task.deleteOne();

        res.status(200).json({
            status: "success",
            message: "Task deleted"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getMyTasks,
    updateTasks,
    deleteTask
};