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

async function excelOp(Boxlistarray,smallboxarray) {
  console.log(smallboxarray)
  let workbook = new Excel.Workbook();
  workbook = await workbook.xlsx.readFile('./ExcelList/dashboard-bb_box.xlsx'); 
  let worksheet = workbook.getWorksheet('Sheet1'); 
  var Sno=1,i=0,j=0
  const d1 = new Date();
  Boxlistarray.forEach((element,index) => {
     let k1=j
   element.SmallBox_Label.forEach((element1,index1) => {
     console.log(element1)
     let t2=j
          for(let l=0;l<smallboxarray.length;l++)
          {

            if(smallboxarray[l].Smallbox1_Label==element1)
            {
              

              for(let m=0;m<smallboxarray[l].Pouch_Label.length;m++)
              {


          worksheet.getRow((2+i+j).toString()).getCell('E').value =smallboxarray[l].Pouch_Label[m]; 
          worksheet.getRow((2+i+j).toString()).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          worksheet.getRow((2+i+j).toString()).getCell('E').font = { size: 12 };
          worksheet.getRow((2+i+j).toString()).getCell('E').border = cellborderStyles;
          
          worksheet.getRow((2+i+j).toString()).getCell('F').value =smallboxarray[l].PartNumber[m]; 
          worksheet.getRow((2+i+j).toString()).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          worksheet.getRow((2+i+j).toString()).getCell('F').font = { size: 12 };
          worksheet.getRow((2+i+j).toString()).getCell('F').border = cellborderStyles;
          
          worksheet.getRow((2+i+j).toString()).getCell('G').value =smallboxarray[l].Name_desc[m];  //part desc
          worksheet.getRow((2+i+j).toString()).getCell('G').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          worksheet.getRow((2+i+j).toString()).getCell('G').font = { size: 12 };
          worksheet.getRow((2+i+j).toString()).getCell('G').border = cellborderStyles;
          
          worksheet.getRow((2+i+j).toString()).getCell('H').value =smallboxarray[l].WEIGHT_UNIT[m]; 
          worksheet.getRow((2+i+j).toString()).getCell('H').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          worksheet.getRow((2+i+j).toString()).getCell('H').font = { size: 12 };
          worksheet.getRow((2+i+j).toString()).getCell('H').border = cellborderStyles;
          
          worksheet.getRow((2+i+j).toString()).getCell('I').value =smallboxarray[l].Quantity[m]; 
          worksheet.getRow((2+i+j).toString()).getCell('I').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          worksheet.getRow((2+i+j).toString()).getCell('I').font = { size: 12 };
          worksheet.getRow((2+i+j).toString()).getCell('I').border = cellborderStyles;
          
          j++
              }
            }
          }

          let t=j
        worksheet.mergeCells('D'+(2+t2)+':D'+(2+t-1))
          worksheet.getRow((2-1+j).toString()).getCell('D').value =element1; 
          worksheet.getRow((2-1+j).toString()).getCell('D').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          worksheet.getRow((2-1+j).toString()).getCell('D').font = { size: 12 };
          worksheet.getRow((2-1+j).toString()).getCell('D').border = cellborderStyles;
               
     });
     let r=j
      worksheet.mergeCells('B'+(2+k1)+':B'+(2+r-1));
      worksheet.mergeCells('C'+(2+k1)+':C'+(2+r-1));
      worksheet.mergeCells('J'+(2+k1)+':J'+(2+r-1));
      worksheet.mergeCells('K'+(2+k1)+':K'+(2+r-1));
      worksheet.mergeCells('L'+(2+k1)+':L'+(2+r-1));
      worksheet.mergeCells('M'+(2+k1)+':M'+(2+r-1));

 
      worksheet.getRow((2+j-1).toString()).getCell('B').value =Sno; 
      Sno+=1
      worksheet.getRow((2+j-1).toString()).getCell('C').value =element.BigBox_Label; 
      worksheet.getRow((2+j-1).toString()).getCell('J').value =element.Box_Type; 
      worksheet.getRow((2+j-1).toString()).getCell('K').value =element.Calculatedweight;  
      worksheet.getRow((2+j-1).toString()).getCell('L').value =element.length+'*'+element.breadth+'*'+element.height; 
      worksheet.getRow((2+j-1).toString()).getCell('M').value =element.Datenow


      worksheet.getRow((2+j-1).toString()).getCell('K').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+j-1).toString()).getCell('B').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+j-1).toString()).getCell('C').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+j-1).toString()).getCell('J').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+j-1).toString()).getCell('L').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+j-1).toString()).getCell('M').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

      worksheet.getRow((2+j-1).toString()).getCell('K').font = {size: 12  };
      worksheet.getRow((2+j-1).toString()).getCell('B').font = {size: 12  };
      worksheet.getRow((2+j-1).toString()).getCell('C').font = {size: 12  };
      worksheet.getRow((2+j-1).toString()).getCell('J').font = { size: 12  };
      worksheet.getRow((2+j-1).toString()).getCell('L').font = { size: 12  };
      worksheet.getRow((2+j-1).toString()).getCell('M').font = { size: 12  };


      worksheet.getRow((2+j-1).toString()).getCell('K').border = cellborderStyles;
      worksheet.getRow((2+j-1).toString()).getCell('B').border = cellborderStyles;
      worksheet.getRow((2+j-1).toString()).getCell('C').border = cellborderStyles;
      worksheet.getRow((2+j-1).toString()).getCell('J').border = cellborderStyles;
      worksheet.getRow((2+j-1).toString()).getCell('L').border = cellborderStyles;
      worksheet.getRow((2+j-1).toString()).getCell('M').border = cellborderStyles;

   

 });  

return(await workbook);
}


  router.post('/', async (req,res) => {
      console.log("Co_parts-excel")
      var b=[]
      let d100=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
          if (err) throw err;
          var dbo = db.db("sdf_project_ver2");
          var date=new Date()
          let day = date.getDate();
          let month = date.getMonth();
          let year = date.getFullYear();
          var start=new Date(year,month,day);
          var end=  new Date(year,month,day+1);
          var query={}
          if(req.body.BoxNo!='')
          query.BigBox_Label=req.body.BoxNo
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
          dbo.collection("co_bigboxes").find(query,{ projection: { _id:0}}).toArray(async function(err, result) {
              if (err) throw err;
              if(result.length!=0)
               {    
                  myResolve(result)
               }
              else
               return res.json("No data")
              })
          })   
      })
      var b=await d100
      var smallboxlbl1=[]
      var smallboxlbl=b.map((element,index)=>{
        element.SmallBox_Label.forEach(element1 => {
          smallboxlbl1.push(element1)
        });
 
      })
      let smallboxlbl2=([...new Set(smallboxlbl1)])
      let d1001=new Promise(function(myResolve, myReject) {MongoClient.connect(url, async function(err, db) {
        var query21=[];
        var dbo = db.db("sdf_project_ver2");

        smallboxlbl2.forEach(element => {
          query21.push ({"Smallbox1_Label":element})
        });
        var query={$or:query21}
        dbo.collection("co_smallbox1").find(query,{ projection: { _id:0,Datenow:0,packageType:0,Operator:0}}).toArray(async function(err, result) {
          myResolve(result)
        })
    })

    })
    var b1=await d1001
      var workbook=await excelOp(b,b1)
      //C:\Users\kirshnan\Desktop\sdf_node_ver2\bigbox.xlsx
      workbook.xlsx.writeFile("./error.xlsx").then(function() {
        console.log("xlsx file is written.");
    });
      res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader("Content-Disposition", "attachment; filename=" +"Big_boxDashboard.xlsx");
       return workbook.xlsx.write(res)
           .then(function(){
               res.end();
           });
       })
         
     
module.exports = router