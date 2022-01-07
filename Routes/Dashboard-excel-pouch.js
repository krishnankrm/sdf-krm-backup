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
  workbook = await workbook.xlsx.readFile('./ExcelList/Dashboard - CO-Pouches.xlsx'); 
  let worksheet = workbook.getWorksheet('Sheet1'); 
  var Sno=1,i=2;
  
  Boxlistarray.forEach(Boxlistarray => { 
  worksheet.getRow((i).toString()).getCell('B').value =Sno; 
  Sno+=1
  worksheet.getRow((i).toString()).getCell('C').value =Boxlistarray.SmallBox_Label; 
  worksheet.getRow((i).toString()).getCell('D').value =Boxlistarray.PartNumber; 
  worksheet.getRow((i).toString()).getCell('E').value =Boxlistarray.Name_desc;  
  worksheet.getRow((i).toString()).getCell('F').value =Boxlistarray.PO_Quantity; 
  worksheet.getRow((i).toString()).getCell('G').value =Boxlistarray.Quantity; 
  worksheet.getRow((i).toString()).getCell('H').value =Boxlistarray.GrossWeight; 
  worksheet.getRow((i).toString()).getCell('I').value =Boxlistarray.Remarks;  
  worksheet.getRow((i).toString()).getCell('J').value =Boxlistarray.Operator; 
  worksheet.getRow((i).toString()).getCell('K').value =Boxlistarray.Datenow; 

  worksheet.getRow((i).toString()).getCell('B').font = {size: 12  };
  worksheet.getRow((i).toString()).getCell('C').font = {size: 12  };
  worksheet.getRow((i).toString()).getCell('D').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('E').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('F').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('G').font = {size: 12  };
  worksheet.getRow((i).toString()).getCell('H').font = {size: 12  };
  worksheet.getRow((i).toString()).getCell('I').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('J').font = { size: 12  };
  worksheet.getRow((i).toString()).getCell('K').font = { size: 12  };
  
  worksheet.getRow((i).toString()).getCell('B').border = cellborderStyles
  worksheet.getRow((i).toString()).getCell('C').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('D').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('E').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('F').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('G').border = cellborderStyles
  worksheet.getRow((i).toString()).getCell('K').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('J').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('H').border = cellborderStyles;
  worksheet.getRow((i).toString()).getCell('I').border = cellborderStyles;


  worksheet.getColumn(10).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

  i++
});

// worksheet.getColumn(3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(2).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(4).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(6).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(7).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(8).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(9).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(10).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
// worksheet.getColumn(11).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

return(await workbook);
}

router.post('/', async (req,res) => {
    console.log("Dashboard excel- pouch")
    MongoClient.connect(url,async function(err, db) {
        if (err) throw err;
        var dbo = db.db("sdf_project_ver2");
        var query={}
        if(req.body.BoxNo!='')
          query.Smallbox1_Label=req.body.BoxNo
        if(req.body.partno!='')
          query.PartNumber=req.body.partno
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
         dbo.collection("co_smallboxes").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
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
      res.setHeader("Content-Disposition", "attachment; filename=" +"PouchesReport.xlsx");
       return workbook.xlsx.write(res)
           .then(function(){
               res.end();
           });
       })
})
module.exports = router
