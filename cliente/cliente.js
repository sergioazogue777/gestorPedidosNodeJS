const express=require("express")
const router=express.Router()
const axios = require('axios')

router.get("/login",(req,res)=>{
    res.render("login")
})
router.post("/login", (req,res)=>{
    usuario={correo:req.body.correo,contrasenya:req.body.contrasenya}
    axios.post("http://localhost:2005/validar",{usuario}).then(respuesta=>{
        if(respuesta.data.token){
            req.session.token=respuesta.data.token
            res.redirect("/pedidos")
        }else{
            res.render("login",{status:"Usuario no encontrado"})
        }
    })
})

router.get("/articulo",(req,res)=>{
    if(req.session.token){
        let ean13=req.query.ean13
        const config = {
            headers:{
                authorization : req.session.token
            }  
        }
        axios.get(`http://localhost:2005/articulos/id?ean13=${ean13}`,config).then(response=>{
            res.status(200).render("modificarArticulo",{articulo:response.data.articulo})
        }).catch(err=>{
            res.status(500).send({status:"error en get articulo"})
        })
    }else{
        res.redirect("/login")
    }
})

router.get("/articulos",(req,res)=>{
    if(req.session.token){
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        axios.get("http://localhost:2005/articulos",config).then(response=>{
            res.status(200).render("articulos",{articulos:response.data.articulos})
        }).catch(err=>{
            res.status(500).send({status:"error"})
        })
    }else{
        res.redirect("/login")
    }
})

router.get("/crearArticulo",(req,res)=>{
    if(req.session.token){
        res.render("crearArticulo")
    }else{
        res.redirect("/login")
    }
})

router.post("/crearArticulo",(req,res)=>{
    if(req.session.token){
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        let articulo={ean13:req.body.ean13,nombre:req.body.nombre,precio:req.body.precio}
        console.log(articulo)
        axios.post("http://localhost:2005/articulos",articulo,config).then(response=>{
            if(response.data.status=="ok"){
                res.redirect("/articulos")
            }else{
                res.render("crearArticulo",{aviso:"Ean13 repetido"})
            }
        }).catch(err=>{
            res.status(500).send({status:"error en post articulo"})
        })
    }else{
        res.redirect("/login")
    }
})

router.post("/articulo",(req,res)=>{
    if(req.session.token){
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        let articulo={ean13:req.body.ean13,nombre:req.body.nombre,precio:req.body.precio}
        axios.put("http://localhost:2005/articulos",articulo,config).then(response=>{
            if(response.data.status=="ok"){
                res.redirect("/articulos")
            }
        }).catch(err=>{
            console.log(err)
            res.status(500).send({status:"error en post articulo"})
        })
    }else{
        res.redirect("/login")
    }
})

router.get("/modificarArticulo",(req,res)=>{
    if(req.session.token){
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        axios.get("http://localhost:2005/articulos",config).then(response=>{
            res.status(200).render("articulos",{articulos:response.data.articulos})
        }).catch(err=>{
            res.status(500).send({status:"error"})
        })
    }else{
        res.redirect("/login")
    }
})

router.get("/crearPedido",(req,res)=>{
    if(req.session.token){
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        axios.get("http://localhost:2005/articulos",config).then(response=>{
            res.status(200).render("crearPedido",{articulos:response.data.articulos})
        }).catch(err=>{
            res.status(500).send({status:"error"})
        })
    }else{
        res.redirect("/login")
    }
})

router.get("/pedidos",(req,res)=>{
    if(req.session.token){
        let pedidos
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        axios.get("http://localhost:2005/pedido",config).then(response=>{
            console.log(response.data.pedidos)
            pedidos=response.data.pedidos
            res.status(200).render("pedidos",{pedidos})
        }).catch(err =>{
            res.status(500).send({status:"error en get pedidos"})
        })
    }else{
        res.redirect("/login")
    }
})

router.post("/pedidos",(req,res)=>{
    if(req.session.token){
        const config = {
            headers:{
                authorization : req.session.token
            }
        }
        const date1=new Date()
        let fechaHoy=date1.getUTCDate()+"/"+(date1.getMonth()+1)+"/"+date1.getUTCFullYear()
        let articulos=[]
        req.body.articulos.forEach(element => {
            if(element.cantidad>0){
                articulos.push(element)
            }
        });
        axios.post("http://localhost:2005/pedido",{fecha:fechaHoy,articulos},config).then(response=>{
            if(response.data.status=="ok"){
                res.redirect("/pedidos")
            }else{
                res.redirect("/pedidos")
            }
        })
    }else{
        redirect("/login")
    }
    
})

router.get("/*",(req,res)=>{
    res.redirect("/login")
})

module.exports=router