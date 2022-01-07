express=require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var Excel = require('exceljs');

var MongoClient = require('mongodb').MongoClient;
// const axios=require('axios')
const getISTTime = () => {
    let d = new Date()
    return d.getTime() + ( 5.5 * 60 * 60 * 1000 )
  }

  var cellborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
  async function excelOp(SmallBoxlistarray,Pouchlistdesc) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('./ExcelList/Smallbox1.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1'); 
    var Sno=1,i=1;
    SmallBoxlistarray.forEach((element,index) => {
      worksheet.mergeCells('B'+(1+i)+':B'+(1+i+element.PartNumber.length-1));
      worksheet.mergeCells('C'+(1+i)+':C'+(1+i+element.PartNumber.length-1));
      worksheet.mergeCells('J'+(1+i)+':J'+(1+i+element.PartNumber.length-1));
      worksheet.mergeCells('K'+(1+i)+':K'+(1+i+element.PartNumber.length-1));
      worksheet.mergeCells('L'+(1+i)+':L'+(1+i+element.PartNumber.length-1));

      element.Pouch_Label.forEach((element1,index1) => {
        worksheet.getRow((1+i).toString()).getCell('D').value =element1; 
        worksheet.getRow((1+i).toString()).getCell('E').value =element.PartNumber[index1]; 
        worksheet.getRow((1+i).toString()).getCell('G').value =element.WEIGHT_UNIT[index1]; 
        worksheet.getRow((1+i).toString()).getCell('H').value ='KGS'
        worksheet.getRow((1+i).toString()).getCell('I').value =element.Quantity[index1];
        Pouchlistdesc.find(function (element12) {
if(element12.pno===element.PartNumber[index1])
worksheet.getRow((1+i).toString()).getCell('F').value =element12.desc

        });
        worksheet.getRow((1+i).toString()).getCell('D').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+i).toString()).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+i).toString()).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+i).toString()).getCell('G').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+i).toString()).getCell('H').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+i).toString()).getCell('I').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        worksheet.getRow((1+i).toString()).getCell('D').font = { size: 12 };
        worksheet.getRow((1+i).toString()).getCell('E').font = { size: 12 };
        worksheet.getRow((1+i).toString()).getCell('F').font = { size: 12 };
        worksheet.getRow((1+i).toString()).getCell('G').font = { size: 12 };
        worksheet.getRow((1+i).toString()).getCell('H').font = { size: 12 };
        worksheet.getRow((1+i).toString()).getCell('I').font = { size: 12 }; 

        worksheet.getRow((1+i).toString()).getCell('D').border = cellborderStyles;
        worksheet.getRow((1+i).toString()).getCell('E').border = cellborderStyles;
        worksheet.getRow((1+i).toString()).getCell('F').border = cellborderStyles;
        worksheet.getRow((1+i).toString()).getCell('G').border = cellborderStyles;
        worksheet.getRow((1+i).toString()).getCell('H').border = cellborderStyles;
        worksheet.getRow((1+i).toString()).getCell('I').border = cellborderStyles;
        i++; 
    });
    worksheet.getRow((i).toString()).getCell('B').value =Sno; 
    Sno+=1
    worksheet.getRow((i).toString()).getCell('C').value =element.Smallbox1_Label; 
    worksheet.getRow((i).toString()).getCell('J').value =element.Netweight; 
    worksheet.getRow((i).toString()).getCell('K').value =element.Datenow; 
    worksheet.getRow((i).toString()).getCell('L').value = element.Operator; 

    worksheet.getRow((i).toString()).getCell('B').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((i).toString()).getCell('C').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((i).toString()).getCell('J').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((i).toString()).getCell('K').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((i).toString()).getCell('L').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.getRow((i).toString()).getCell('B').font = {size: 12  };
    worksheet.getRow((i).toString()).getCell('C').font = {size: 12  };
    worksheet.getRow((i).toString()).getCell('J').font = { size: 12  };
    worksheet.getRow((i).toString()).getCell('K').font = { size: 12  };
    worksheet.getRow((i).toString()).getCell('L').font = { size: 12  };

  
    worksheet.getRow((i).toString()).getCell('B').border = cellborderStyles;
    worksheet.getRow((i).toString()).getCell('C').border = cellborderStyles;
    worksheet.getRow((i).toString()).getCell('J').border = cellborderStyles;
    worksheet.getRow((i).toString()).getCell('K').border = cellborderStyles;
    worksheet.getRow((i).toString()).getCell('L').border = cellborderStyles;

  
  
  });  
  return(await workbook);
  }

  
router.get('/excel', async (req,res) => {
    console.log("Smallbox-excel")
    var b=[],c=[],d=[]
    let d100=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var date=new Date()
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        var start=new Date(year,month,day);
        var end=  new Date(year,month,day+1);
        var query={}
        query.Datenow={
                "$gte": start,
                "$lt": end
              }
        dbo.collection("co_smallbox1").find(query,{ projection: { _id:0,__v:0}}).toArray(async function(err, result) {
            if (err) throw err;
            if(result.length!=0)
             {     
                b=result
                myResolve(1)    
             }
            else
             return res.json("No data")
            })
        })   })
    })
        let d1= await d100
        let d101=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
            MongoClient.connect(url, async function(err, db) {
                if (err) throw err;
                var dbo = db.db("sdf_project_ver2");
                dbo.collection("sap_cos").find({},{ projection: { _id:0,pno:1,desc:1}}).toArray(async function(err, result) {
                    if (err) throw err;
                    if(result.length!=0)
                     {     
                        c=result
                        myResolve(1)     
                     }
                    else
                     return res.json("No data in Sap")
                    })
                })   
            })
        })
        let d2=  await d101
        var workbook=await excelOp(b,c)
        res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" +"Smallbox_Report.xlsx");
         return workbook.xlsx.write(res)
             .then(function(){
                 res.end();
             });
           })


  
module.exports = router