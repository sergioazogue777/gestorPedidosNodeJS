const express = require("express")
const router = express.Router()
const db = require('./firebase.js');
const comprobarToken = require("./comprobarToken")

router.get("/", comprobarToken, async (req, res) => {
    articulos = []
    await db.collection('articulos').get().then(datos => {
        datos.forEach(doc => {
            articulos.push({ ean13: doc.data().ean13, nombre: doc.data().nombre, precio: doc.data().precio });
        })
        res.status(200).send({ status: "ok", articulos })
    }).catch(err => {
        console.log(err);
        res.status(500).send({ status: err })
    })
})

router.get("/id", comprobarToken, (req, res) => {
    db.collection("articulos").where("ean13", "==", req.query.ean13).get().then(docs => {
        docs.forEach(doc => {
            let articulo = { ean13: doc.data().ean13, nombre: doc.data().nombre, precio: doc.data().precio }
            console.log(articulo)
            res.status(200).send({ status: "ok", articulo })
        })
    }).catch(err => {
        res.status(500).send({ status: "error" })
    })
})

router.post("/", comprobarToken, async (req, res) => {
    console.log(req.body)
    await db.collection("articulos").where("ean13", "==", req.body.ean13).get().then(async docs => {
        let cnt = 0;
        docs.forEach(doc => {
            cnt = cnt + 1
        })
        if (cnt == 0) {
            await db.collection('articulos').doc().set({ ean13: req.body.ean13, nombre: req.body.nombre, precio: req.body.precio })

            res.status(200).send({ status: "ok" })
        } else {
            res.status(200).send({ status: "error1" })
        }

    }).catch(err => {
        console.log("error en post articulo")
        res.status(500).send({ status: "error2" })
    })
})

router.put("/", comprobarToken, async (req, res) => {
    let id
    console.log(req.body)
    await db.collection("articulos").where("ean13", "==", req.body.ean13).get().then(docs => {
        docs.forEach(doc => {
            id = doc.id
            console.log(id)
        })
    })
    let articulo = { nombre: req.body.nombre, ean13: req.body.ean13, precio: req.body.precio }
    console.log(id)
    await db.collection('articulos').doc(id).set(articulo)
    res.status(200).send({ status: "ok" })
})

module.exports = router