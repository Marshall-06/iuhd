const Group = require("../models/model").Group;

exports.createGroup = async (req, res) => {
    try{
        const {name} = req.body;
    if (!name){
        return res.status(400).json({message: "Group name is required"});
    }

    const group = await Group.create({name: name});
    return res.status(201).json({message: "Group created", group})
    }catch(err){
        res.status(500).json({error: err.message});
    }

}

exports.getAllGroups = async (req, res) => {
    try{
        const groups = await Group.findAll();
        return res.status(200).json({groups});  
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getGroupById = async (req, res) => {
    const {id} = req.params;
    try{
        const group = await Group.findByPk(id);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        return res.status(200).json({group});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateGroup = async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    try{
        const group = await Group.findByPk(id);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        await group.update({name: name});
        return res.status(200).json({message: "Group updated", group});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteGroup = async (req, res) => {
    const {id} = req.params;
    try{
        const group = await Group.findByPk(id);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        await group.destroy();
        return res.status(200).json({message: "Group deleted"});
    }catch(err){
        res.status(500).json({error: err.message});     
    }
}

exports.getAllGroups = async (req, res) => {
    try{
        const groups = await Group.findAll();
        return res.status(200).json({groups});  
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getGroupById = async (req, res) => {
    const {id} = req.params;
    try{
        const group = await Group.findByPk(id);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        return res.status(200).json({group});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateGroup = async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    try{
        const group = await Group.findByPk(id);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        await group.update({name: name});
        return res.status(200).json({message: "Group updated", group});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteGroup = async (req, res) => {
    const {id} = req.params;
    try{
        const group = await Group.findByPk(id);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        await group.destroy();
        return res.status(200).json({message: "Group deleted"});
    }catch(err){
        res.status(500).json({error: err.message});     
    }
}