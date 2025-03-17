import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

export const addProject = async (name, userId) => {
    try {
        if (!name?.trim()) {
            throw new ApiError(400, "Project name is required.");
        }
        if (!userId) {
            throw new ApiError(400, "User ID is required.");
        }

        // Create a new project
        const project = await Project.create({
            name,
            users: [userId], // Assuming `users` is an array in your schema
        });

        return project;
    } catch (error) {
        throw error; // Pass error to the calling function
    }
};

export const getProjectsByUserId = async (userId) => {
    try {
        if (!userId) {
            throw new ApiError(400, "User ID is required.");
        }

        // Find all projects where the user is a member
        const projects = await Project.find({ users: userId });

        return projects;
    } catch (error) {
        throw error; // Pass error to the calling function
    }
};

export const updateProjectById = async (name, id, userId) => {
    try {
        if (!name?.trim()) {
            throw new ApiError(400, "Project name is required.");
        }
        if (!id) {
            throw new ApiError(400, "Project ID is required.");
        }
        if (!userId) {
            throw new ApiError(400, "User ID is required.");
        }

        // Find the project by ID
        const project = await Project.findById(id);

        // Check if the user is a member of the project
        if (!project.users.includes(userId)) {
            throw new ApiError(403, "Forbidden: You are not a member of this project.");
        }

        // Update the project
        project.name = name;
        await project.save();

        return project;
    } catch (error) {
        throw error; // Pass error to the calling function
    }
};

export const addNewUserToProject = async (projectId, users , userId) => {
    try {
        if (!projectId) {
            throw new ApiError(400, "Project ID is required.");
        }
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new ApiError(400 , "Invalid projectId")
        }
        if (!users?.length) {
            throw new ApiError(400, "Users are required.");
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId")
        }

        // Find the project by ID
        const project = await Project.findOne({
            _id: projectId,
            users: userId
        });
    
        if (!project) {
            throw new ApiError(401, "User not belong to this project")
        }

        const updatedProject = await Project.findOneAndUpdate({
            _id: projectId
        }, {
            $addToSet: {
                users: {
                    $each: users
                }
            }
        }, {
            new: true
        });
        
        return updatedProject;
        
    } catch (error) {
        throw error; // Pass error to the calling function
    }
};

export const getProjectByIdSercive = async (projectId) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    const project = await Project.findOne({
        _id: projectId
    }).populate('users')

    return project;
}