const express=require("express")
const router=express.Router()
const db = require('./firebase.js');
const jwt = require('jsonwebtoken');


router.post("/",async (req,res)=>{
    let validado=false
    await db.collection("usuarios").where("correo","==",req.body.usuario.correo).get().then(docs=>{
        docs.forEach(doc=>{
            if(doc.data().contrasenya==req.body.usuario.contrasenya){
                validado=true
                token=jwt.sign({ foo: doc.id }, "joaquin");
            }
        })
    }) 
    if(validado){
        
        res.status(200).send({status:"ok",token})
    }else{
        res.status(401).send("Error de autentificación")
    }
})

module.exports=router