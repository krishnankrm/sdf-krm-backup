const express = require('express')
const mongodb=require('mongodb').MongoClient;
const app = express()
var cors = require('cors')
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const bodyParser = require('body-parser');
var config = require('./config');
const url = config.url
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(errorHandler);
app.use(jwt());
var Excel = require('exceljs');

var port = process.env.PORT||1007

app.use('/users', require('./users/users.controller'));
app.use('/engine', require('./Routes/engine_router'));
app.use('/boxno', require('./Routes/boxno.js'));
app.use('/boxlist', require('./Routes/boxlist.js'));
app.use('/user_access', require('./Routes/user_access.js'));
app.use('/otherparts', require('./Routes/otherparts.js'));
app.use('/transmission', require('./Routes/transmission.js'));
app.use('/CO_smallbox', require('./Routes/CO_smallbox.js'));
app.use('/CO_smallbox1', require('./Routes/CO_smallbox1.js'));
app.use('/CO_bigbox', require('./Routes/CO_bigbox.js'));
app.use('/CO_bigboxexcel', require('./Routes/CO_excel.js'));
app.use('/CO_smallboxexcel', require('./Routes/CO_smallboxexcel.js'));
app.use('/Dashboard', require('./Routes/Dashboard.js'));
app.use('/Dashboard1/bigbox', require('./Routes/Dashboard-excel-bigbox.js'));
app.use('/Dashboard1/pouches', require('./Routes/Dashboard-excel-pouch.js'));
app.use('/Dashboard1/smallbox', require('./Routes/Dashboard-excel-smallbox.js'));
app.use('/Dashboard1/otherparts', require('./Routes/Dashboard-excel-otherparts.js'));
app.use('/Dashboard1/transmission', require('./Routes/Dashboard-excel-transmission.js'));
app.use('/Dashboard1/engine', require('./Routes/Dashboard-excel-engine.js'));
app.use('/SAP', require('./Routes/Sap-CO.js'));
app.use('/tracer', require('./Routes/tracer.js'));
app.use('/RemainingPODashboard', require('./Routes/RemainingPO.js'));
app.use('/weighingmachine_serialport', require('./Routes/weighingmachine_serialport.js'));
app.use('/RemainingPOexcel', require('./Routes/excel.js'));
app.use('/master', require('./Routes/Inventory.js'));
app.use('/chart', require('./Routes/chart.js'));

async function excelOp() {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('./ExcelList/boxtype.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1'); 
    var excelrowindex=[3,4,5,6,7,8,9],returnval={"listname":[],"length":[],"breadth":[],"height":[],"tare_weight":[]}
    for (let k in excelrowindex)
    {   
    returnval.listname.push(worksheet.getRow(excelrowindex[k]).getCell('H').value)
    returnval.length.push(worksheet.getRow(excelrowindex[k]).getCell('I').value)
    returnval.breadth.push(worksheet.getRow(excelrowindex[k]).getCell('J').value)
    returnval.height.push(worksheet.getRow(excelrowindex[k]).getCell('K').value)
    returnval.tare_weight.push(worksheet.getRow(excelrowindex[k]).getCell('L').value)
    }    
    return(returnval)
}

// mongodb.connect(url,function(err,db){
//     console.log("DB connected");
//     var s=0
//     var dbo = db.db("sdf_project_ver2");
//     dbo.listCollections().toArray(function(err, items) {
//         for(i=0;i<items.length;i++)
//         if(items[i].name=='login')
//         s=1;
//         if(s==0){
//                     dbo.createCollection("Boxlist", function(err, res) {
//                     console.log("Collection created!");   
//                     var array=excelOp()
//                     if(typeof array.listname!='undefined')
//                     for(i=0;i<array.listname.length;i++)
//                     var myobj = { Sizelist: array.listname[i], Length: array.length[i],Breadth: array.breadth[i], Height: array.height[i], Tare_Weight:  array.tare_weight[i] };
//                     dbo.collection("Boxlist").insertOne(myobj, function(err, res) {
//                     if(err) console.log(err)
//                     console.log("1 document inserted");
//                     db.close(); 
//                     });
//                 })
//             }
//   })})

mongodb.connect(url,function(err,db){
    console.log("DB connected");
    var s=0
    var dbo = db.db("sdf_project_ver2");
    dbo.listCollections().toArray(function(err, items) {
        for(i=0;i<items.length;i++)
        if(items[i].name=='login')
        s=1;
        if(s==0){
                    dbo.createCollection("login",async function(err, res) {
                    console.log("Collection created!");   
                    var myobj = { user: "admin", pass: "admin",access: 'admin', email: 'admin@default.com', name: 'Parent-admin' };
                    dbo.collection("login").insertOne(myobj,async function(err, res) {
                    if(err) console.log(err)
                    console.log("1 document inserted");
                    dbo.createCollection("boxlists", async function(err, res) {
                        console.log("Collection created!");   
                        var array=await excelOp()
                        if(typeof array.listname!='undefined')
                        for(i=0;i<array.listname.length;i++)
                     {   var myobj1 = { Sizelist: array.listname[i].toUpperCase(), Length: array.length[i],Breadth: array.breadth[i], Height: array.height[i], Tare_Weight:  array.tare_weight[i] };
                        dbo.collection("boxlists").insertOne(myobj1, function(err, res) {
                        if(err) console.log(err)
                        console.log("1 document inserted");
                    });}
                })
            })
  })
}
})
})
app.listen(port, () => {
    console.log('Server started @' +port)
})