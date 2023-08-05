import User from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email','role','status','phone','image']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role','status','phone','image'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    const {name, email, password, confPassword, role,status,phone,image} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
           
            status: status,
            phone: phone,
          
            image: req.file.path
        });
        res.status(201).json({msg: "Successfull creation"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    const {name, email, password, confPassword, role,status,phone,image} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            status:status,
            phone: phone,
            image: req.file.path,
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const getUserCount = async (req, res) => {
    try {
      const count = await User.count();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user count' });
    }
  };




  export const updateUserProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const { userId } = req.user; // Assuming you have implemented user authentication
  
    try {
      const user = await User.findOne({ where: { id: userId } });
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      user.name = name;
      user.email = email;
      user.phone = phone;
  
      await user.save();
  
      res.status(200).json({ msg: 'Profile updated successfully' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };




const storage = multer.diskStorage({
    destination: (req , file, cb) =>{
        cb(null, 'Images')
    },
    filename: (req  , file , cb) => {

        cb(null, Date.now() + path.extname(file.originalname))

    }
})

export const upload = multer({
    storage :storage,
    limits: {fieldSize: '1000000'},
    fileFilter: (req , file , cb) =>{
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))
        if(mimeType && extname ){
            return cb(null, true)
        }
        cb("give proper file format")
    }
}).single('image')