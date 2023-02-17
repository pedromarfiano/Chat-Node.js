const router = require('express').Router()

var path = require('path');


router.get('/' , (req , res)=>{
    res.sendFile(__dirname+'../index.html');
})


// router.get('/another-route' , (req , res)=>{
//     // router code here
// })

module.exports  = router