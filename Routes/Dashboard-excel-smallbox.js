const express = require('express')
const router = express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;
var Excel = require('exceljs');

var cellborderStyles = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" }
};

async function excelOp(Boxlistarray) {
  let workbook = new Excel.Workbook();
  workbook = await workbook.xlsx.readFile('./ExcelList/Dashboard - CO-smallbox.xlsx'); 
  let worksheet = workbook.getWorksheet('Sheet1'); 
  var Sno=1,i=1;
  Boxlistarray.forEach((element,index) => {

    worksheet.mergeCells('B'+(1+i)+':B'+(1+i+element.PartNumber.length-1));
    worksheet.mergeCells('C'+(1+i)+':C'+(1+i+element.PartNumber.length-1));
    worksheet.mergeCells('J'+(1+i)+':J'+(1+i+element.PartNumber.length-1));
    worksheet.mergeCells('H'+(1+i)+':H'+(1+i+element.PartNumber.length-1));
    worksheet.mergeCells('I'+(1+i)+':I'+(1+i+element.PartNumber.length-1));

    element.PartNumber.forEach((element1,index1) => {
      worksheet.getRow((1+i).toString()).getCell('D').value =element.Pouch_Label[index1]; 
      worksheet.getRow((1+i).toString()).getCell('E').value =element1; 
      worksheet.getRow((1+i).toString()).getCell('F').value =element.Quantity[index1]; 
      worksheet.getRow((1+i).toString()).getCell('G').value =(+element.Quantity[index1])*(+element.WEIGHT_UNIT[index1])

      worksheet.getRow((1+i).toString()).getCell('D').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((1+i).toString()).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((1+i).toString()).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((1+i).toString()).getCell('G').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
     
      worksheet.getRow((1+i).toString()).getCell('D').font = { size: 12 };
      worksheet.getRow((1+i).toString()).getCell('E').font = { size: 12 };
      worksheet.getRow((1+i).toString()).getCell('F').font = { size: 12  };
      worksheet.getRow((1+i).toString()).getCell('G').font = {size: 12  };
     
      worksheet.getRow((1+i).toString()).getCell('D').border = cellborderStyles;
      worksheet.getRow((1+i).toString()).getCell('E').border = cellborderStyles;
      worksheet.getRow((1+i).toString()).getCell('F').border = cellborderStyles;
      worksheet.getRow((1+i).toString()).getCell('G').border = cellborderStyles;
      i++; 
  });
  worksheet.getRow((i).toString()).getCell('B').value =Sno; 
  Sno+=1
  worksheet.getRow((i).toString()).getCell('C').value =element.Smallbox1_Label; 
  worksheet.getRow((i).toString()).getCell('J').value =element.Datenow; 
  worksheet.getRow((i).toString()).getCell('H').value =element.Netweight;  
  worksheet.getRow((i).toString()).getCell('I').value =element.Operator; 

  worksheet.getRow((i).toString()).getCell('J').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  worksheet.getRow((i).toString()).getCell('B').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  worksheet.getRow((i).toString()).getCell('C').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  worksheet.getRow((i).toString()).getCell('H').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  worksheet.getRow((i).toString()).getCell('I').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  
  worksheet.getRow((i).toString()).getCell('B').font = {size: 12  };
  worksheet.getRow((i).toString()).getCell('C').font = {size: 12  };
  worksheet.getRow((i).toString()).getCell('J').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('H').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('I').font = { size: 12  };


  worksheet.getRow((i).toString()).getCell('B').border = cellborderStyles
  worksheet.getRow((i).toString()).getCell('C').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('J').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('H').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('I').border = cellborderStyles;

});  
return(await workbook);
}

router.post('/', async (req,res) => {
    console.log("Dashboard excel- smallbox")
    MongoClient.connect(url,async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var query={}
        if(req.body.BoxNo!='')
          query.Smallbox1_Label=req.body.BoxNo
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
       let k= new Promise((resolve,reject)=>{ 
         dbo.collection("co_smallbox1").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
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
              return res.status(404).json({msg: "No records found for this Query"});
          });
        });
   
      let arrayafterquery= await k
      var workbook=await excelOp(arrayafterquery)
      res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader("Content-Disposition", "attachment; filename=" +"SmallboxReport.xlsx");
       return workbook.xlsx.write(res)
           .then(function(){
               res.end();
           });
       })
})
module.exports = router
