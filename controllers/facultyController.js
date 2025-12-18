const Faculty = require("../models/model").Faculty;

exports.createFaculty = async (req, res) => {
    try{
        const {name} = req.body;
    if (!name){
        return res.status(400).json({message: "Faculty name is required"});
    }

    const faculty = await Faculty.create({name: name});
    return res.status(201).json({message: "Faculty created", faculty})
    }catch(err){
        res.status(500).json({error: err.message});
    }

}

exports.getAllFaculties = async (req, res) => {
    try{
        const faculties = await Faculty.findAll();
        return res.status(200).json({faculties});  
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getFacultyById = async (req, res) => {
    const {id} = req.params;
    try{
        const faculty = await Faculty.findByPk(id);
        if (!faculty){
            return res.status(404).json({message: "Faculty not found"});
        }
        return res.status(200).json({faculty});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateFaculty = async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    try{
        const faculty = await Faculty.findByPk(id);
        if (!faculty){
            return res.status(404).json({message: "Faculty not found"});
        }
        await faculty.update({name: name});
        return res.status(200).json({message: "Faculty updated", faculty});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteFaculty = async (req, res) => {
    const {id} = req.params;
    try{
        const faculty = await Faculty.findByPk(id);
        if (!faculty){
            return res.status(404).json({message: "Faculty not found"});
        }
        await faculty.destroy();
        return res.status(200).json({message: "Faculty deleted"});
    }catch(err){
        res.status(500).json({error: err.message});     
    }
}