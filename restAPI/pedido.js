const express=require("express")
const router=express.Router()
const db = require('./firebase.js');
const comprobarToken=require("./comprobarToken")

router.get("/",comprobarToken,async (req,res)=>{
    pedidos=[]
    await db.collection('pedidos').get().then(datos =>{
        datos.forEach( doc =>{
            if(doc.data().cliente==req.id){
                pedidos.push(doc.data())
            }
        })
        res.status(200).send({pedidos})

    }).catch(err =>{
        res.status(500).send({status:error})
    })
})

router.post("/",comprobarToken,async (req,res)=>{
    await db.collection('pedidos').doc().set({cliente:req.id,fecha:req.body.fecha,articulos:req.body.articulos})
    res.status(200).send({status:"ok"})
})


module.exports=router