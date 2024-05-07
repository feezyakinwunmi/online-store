const bcrypt = require("bcrypt")
const joi = require("joi");
const express = require("express");
const{User} =require("../modules/user")
const generateAuthToken = require("../utils/generateAuthToken");

const router = express.Router()

router.post("/",async (req,res)=>{
    const schema = joi.object({
        name:joi.string().min(3).required().max(30),
        email:joi.string().min(3).max(200).required().email(),
        password:joi.string().min(6).max(200).required()
    })

    
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists...");

  console.log("here");

  const { name, email, password } = req.body;

  
  user = new User({ name, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = generateAuthToken(user);

  res.send(token);
});

module.exports = router;
    
