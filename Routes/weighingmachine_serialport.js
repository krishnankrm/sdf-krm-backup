const express = require('express')
const router = express.Router()
var spawn = require("child_process").spawn;

router.post('/', callName);
  
function callName(req, res) {
    var process = spawn('python',["./testserialport.py",] );
    process.stdout.on('data', function(data,err) {
        var a={'msg':(data.toString()).slice(0,-3)}
        res.json(a)
    } )
}


module.exports=router