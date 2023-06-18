const { initializeApp,cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
let serviceAccount = require(__dirname+"/joaquin.json");
initializeApp({
  credential: cert(serviceAccount)
});
let db = getFirestore();
module.exports =db;