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

  async function excelOp(array) {
    console.log(array)
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('./ExcelList/dashboard-engine.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1');
    let SNO=1;
    k=1;
    for (var i = 0; i <array.length ; i++) 
    {      
      console.log(array[i])
      worksheet.getRow((2+i).toString()).getCell('A').value = i+1;
      worksheet.getRow((2+i).toString()).getCell('B').value = array[i].Pno
      worksheet.getRow((2+i).toString()).getCell('C').value = array[i].serial_number
      worksheet.getRow((2+i).toString()).getCell('D').value = array[i].Sap
      worksheet.getRow((2+i).toString()).getCell('E').value = ' '
      worksheet.getRow((2+i).toString()).getCell('F').value = array[i].BoxNo
      worksheet.getRow((2+i).toString()).getCell('G').value = array[i].Net_weight
      worksheet.getRow((2+i).toString()).getCell('H').value = array[i].Gross_weight
      // worksheet.getRow((2+i).toString()).getCell('I').value = array[i].Length+'*'+array[i].Width+'*'+array[i].Height
      worksheet.getRow((2+i).toString()).getCell('I').value = array[i].Datenow

      worksheet.getRow((2+i).toString()).getCell('A').font = {          name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('B').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('C').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('D').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('E').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('F').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('G').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('H').font = {           name: 'Arial', size: 10};
    // worksheet.getRow((2+i).toString()).getCell('I').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('I').font = {           name: 'Arial', size: 10};

      worksheet.getRow((2+i).toString()).getCell('A').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('B').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('C').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('D').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('E').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('F').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('G').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('H').border = cellborderStyles
    // worksheet.getRow((2+i).toString()).getCell('I').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('I').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('A').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('B').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('C').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('D').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('G').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('H').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getRow((2+i).toString()).getCell('I').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('I').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    //     for (var j = 0; j <array[i].ModelNo.length ; j++) 
    //     {   
    //         local_model.push(array[i].ModelNo[j])
    //         local_Sap.push(array[i].Sap[j])
    //         if(j==0)
    //         {local_StackNo.push(array[i].StackNo)
    //         boxno.push(array[i].StackNo)
    //         Date.push(array[i].Datenow)}
        
    //         else
    //        {    local_StackNo.push(' ')
    //         boxno.push(' ')
    //         Date.push(' ')}
    //     }
    // }
       
    // workbook = await workbook.xlsx.readFile('./ExcelList/Dashboard-transmission.xlsx'); 
    // let worksheet = workbook.getWorksheet('Sheet1');   
    // 
     
    //   for (var i = 1; i <local_model.length+1 ; i++) 
    //   {  
    //       if(local_StackNo[i-1]==' ')
    //       {
    //           worksheet.mergeCells('F'+(i)+':F'+(i+1));
    //           worksheet.mergeCells('G'+(i)+':G'+(i+1));
    //           worksheet.mergeCells('H'+(i)+':H'+(i+1));
    //       }
    //       worksheet.getRow((1+i).toString()).getCell('C').value = i;
    //       worksheet.getRow((1+i).toString()).getCell('D').value = local_model[i-1];
    //       worksheet.getRow((1+i).toString()).getCell('E').value = local_Sap[i-1];
    //       if(local_StackNo[i-1]!=' ')
    //      {
    //         worksheet.getRow((1+i).toString()).getCell('G').value = boxno[i-1];
    //         worksheet.getRow((1+i).toString()).getCell('H').value = Date[i-1];
    //      worksheet.getRow((1+i).toString()).getCell('F').value = local_StackNo[i-1];
    //     }
    //       worksheet.getRow((1+i).toString()).getCell('C').font = {           name: 'Arial', size: 12         };
    //       worksheet.getRow((1+i).toString()).getCell('D').font = {           name: 'Arial', size: 12         };
    //       worksheet.getRow((1+i).toString()).getCell('E').font = {           name: 'Arial', size: 12         };
    //       worksheet.getRow((1+i).toString()).getCell('F').font = {           name: 'Arial', size: 12          };
    //       worksheet.getRow((1+i).toString()).getCell('G').font = {           name: 'Arial', size: 12          };
    //       worksheet.getRow((1+i).toString()).getCell('H').font = {           name: 'Arial', size: 12          };

    //       worksheet.getRow((1+i).toString()).getCell('C').border = cellborderStyles
    //       worksheet.getRow((1+i).toString()).getCell('D').border = cellborderStyles
    //       worksheet.getRow((1+i).toString()).getCell('E').border = cellborderStyles
    //       worksheet.getRow((1+i).toString()).getCell('F').border = cellborderStyles
    //       worksheet.getRow((1+i).toString()).getCell('G').border = cellborderStyles
    //       worksheet.getRow((1+i).toString()).getCell('H').border = cellborderStyles
    //     //   worksheet.getRow((1+i).toString()).getCell('B').border = leftborderStyles
    //     //   worksheet.getRow((1+i).toString()).getCell('H').border = rightborderStyles
         
  
      }
   
    return(await workbook);

}

router.post('/', async (req,res) => {
        console.log("Dashboard excel- transmission")
        MongoClient.connect(url,async function(err, db) {
            if (err) throw err;
            var dbo = db.db("sdf_project_ver2");
            var query={}
            if(req.body.BoxNo!='')
              query.BoxNo=req.body.BoxNo
            if(req.body.Pno!='')
              query.Pno=req.body.Pno
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
               dbo.collection("engines").find(query, { projection: { _id:0,__v: 0,packageType:0}}).toArray(function(err, result) {
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
                resolve(result)

              });
            });
       
          let arrayafterquery= await k
          var workbook=await excelOp(arrayafterquery)
          res.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader("Content-Disposition", "attachment; filename=" +"Engine_Summary_Report.xlsx");
           return workbook.xlsx.write(res)
               .then(function(){
                   res.end();
               });
              })
    })
module.exports = router