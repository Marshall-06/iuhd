const Department = require("../models/model").Department;

exports.createDepartment = async (req, res) => {
    try{
        const {name} = req.body;
    if (!name){
        return res.status(400).json({message: "Department name is required"});
    }

    const department = await Department.create({name: name});
    return res.status(201).json({message: "Department created", department})
    }catch(err){
        res.status(500).json({error: err.message});
    }

}

exports.getAllDepartments = async (req, res) => {
    try{
        const departments = await Department.findAll();
        return res.status(200).json({departments});  
    }catch(err){
        res.status(500).json({error: err.message});
    }

}

exports.getAllDepartments = async (req, res) => {
    try{
        const departments = await Department.findAll();
        return res.status(200).json({departments});  
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getDepartmentById = async (req, res) => {
    const {id} = req.params;
    try{
        const department = await Department.findByPk(id);
        if (!department){
            return res.status(404).json({message: "Department not found"});
        }
        return res.status(200).json({department});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateDepartment = async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    try{
        const department = await Department.findByPk(id);
        if (!department){
            return res.status(404).json({message: "Department not found"});
        }
        await department.update({name: name});
        return res.status(200).json({message: "Department updated", department});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteDepartment = async (req, res) => {
    const {id} = req.params;
    try{
        const department = await Department.findByPk(id);
        if (!department){
            return res.status(404).json({message: "Department not found"});
        }
        await department.destroy();
        return res.status(200).json({message: "Department deleted"});
    }catch(err){
        res.status(500).json({error: err.message});     
    }
}