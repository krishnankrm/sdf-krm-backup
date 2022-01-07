const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var Excel=require('exceljs')
var MongoClient = require('mongodb').MongoClient;

var cellborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
  
  async function excelOp(array,weightSaparray) {
    let workbook = new Excel.Workbook();
    let SNO=1;
    k=1;
    workbook = await workbook.xlsx.readFile('./ExcelList/Dashboard - other.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1');   
    let Box_Type
    var cellborderStyles = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
     
    array.forEach((element,i) => {

        worksheet.mergeCells('L'+(1+SNO)+':L'+(1+SNO+element.PartNumber.length-1));
        worksheet.mergeCells('M'+(1+SNO)+':M'+(1+SNO+element.PartNumber.length-1));
        worksheet.mergeCells('B'+(1+SNO)+':B'+(1+SNO+element.PartNumber.length-1));
        worksheet.mergeCells('N'+(1+SNO)+':O'+(1+SNO+element.PartNumber.length-1));

        element.PartNumber.forEach((element1,j) => {
        worksheet.mergeCells('C'+(1+SNO)+':D'+(1+SNO));
        worksheet.mergeCells('E'+(1+SNO)+':G'+(1+SNO));
        worksheet.getColumn(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow((1+SNO).toString()).getCell('C').value=element1; 
        worksheet.getRow((1+SNO).toString()).getCell('K').value=element.GrossWeight[j]; 
        worksheet.getRow((1+SNO).toString()).getCell('B').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('C').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('K').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('E').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('H').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('I').border = cellborderStyles
        worksheet.getRow((1+SNO).toString()).getCell('J').border = cellborderStyles
        weightSaparray.forEach((element100,j100) => {
        if(element1==element100.material)
          {
            worksheet.getRow((1+SNO).toString()).getCell('F').value=element100.desc; 
            worksheet.getRow((1+SNO).toString()).getCell('I').value=element100.uom; 
          }
        })
        SNO+=1
        })
        Box_Type=element['Box_Type']
        worksheet.getRow((0+SNO).toString()).getCell('L').value=(+element.Netweight)
        worksheet.getRow((0+SNO).toString()).getCell('M').value=element.boxNo
        worksheet.getRow((0+SNO).toString()).getCell('B').value=k; 
        worksheet.getRow((0+SNO).toString()).getCell('N').value=element.Datenow
        k+=1
        worksheet.getRow((0+SNO).toString()).getCell('L').border = cellborderStyles
        worksheet.getRow((0+SNO).toString()).getCell('M').border = cellborderStyles
        worksheet.getRow((0+SNO).toString()).getCell('N').border = cellborderStyles      
        worksheet.getRow((0+SNO).toString()).getCell('N').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    for(let i=1;i<=14;i++){
      worksheet.getColumn(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }
    
    return(await workbook);

}


       router.post('/', async (req,res) => {
        console.log("Dashboard excel- other")
        var c=[]
        MongoClient.connect(url,async function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            var query={}
            if(req.body.BoxNo!='')
              query.boxNo=req.body.BoxNo
            if(req.body.Start!='' && req.body.Stop!='')
              { 
                var start= new Date(req.body.Start);
                var end= new Date (req.body.Stop)
                end.setDate(end.getDate() + 1);
                query.Datenow={
                      "$gte": start,
                      "$lt": end
                    }
              }
            else if(req.body.Start!=''  && req.body.Stop=='')
            {
              var start= new Date(req.body.Start);
              query.Datenow={
                    "$gte": start,
                  }
            }
            else if(req.body.Start==''  && req.body.Stop!='')
            {
              var end= new Date (req.body.Stop)
              end.setDate(end.getDate() + 1);
              query.Datenow={
                    "$lt": end
                  }
            }
           let k= new Promise((resolve,reject)=>{ dbo.collection("otherparts").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
                if (err) throw err;
                if(result.length!=0)
                {      result.map(itm=>{
                       let newdt= itm.Datenow.toISOString().split('T')
                       itm.Datenow=newdt[0]
   
                       return itm
                        })
                        resolve(result)
                }
               else
               {
                 resolve(result)
               }
              });
            });

          let arrayafterquery= await k
          let d1001=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            dbo.collection("sap_weight_trans1").find({},{ projection: { _id:0}}).toArray(async function(err, result323) {
                if (err) throw err;
                if(result323.length!=0)
                 {    
                    c=result323
                    myResolve(1)
                 }
                 else
                 {
                   console.log(32)
                 }
                })
            })   
    
        })
        let d12= await d1001
          var workbook=await excelOp(arrayafterquery,c)
          res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader("Content-Disposition", "attachment; filename=" +"Otherparts_Summary_Report.xlsx");
           return workbook.xlsx.write(res)
               .then(function(){
                   res.end();
               });
             })
    })
module.exports = router