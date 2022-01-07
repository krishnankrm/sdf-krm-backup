const express = require('express')
const router = express.Router()
var config = require('../config');
var Excel=require('exceljs');
var MongoClient = require('mongodb').MongoClient;
const url = config.url

var cellborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
  var cellborderStyles1 = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };

  async function excelOp(array) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('./ExcelList/blank.xlsx'); 
    let worksheet = workbook.getWorksheet('Sheet1');
    let SNO=1;
    k=1;
    worksheet.getRow((1).toString()).getCell('A').value = 'S.No'
    worksheet.getRow((1).toString()).getCell('B').value = 'Material'
    worksheet.getRow((1).toString()).getCell('C').value = 'Part Desc'
    worksheet.getRow((1).toString()).getCell('D').value = 'Type'
    worksheet.getRow((1).toString()).getCell('E').value = 'Total Qty'
    worksheet.getRow((1).toString()).getCell('F').value = 'Remaining Qty'

    worksheet.getRow((1).toString()).getCell('A').font = {           name: 'Arial', size: 12};
    worksheet.getRow((1).toString()).getCell('B').font = {           name: 'Arial', size: 12};
    worksheet.getRow((1).toString()).getCell('C').font = {           name: 'Arial', size: 12};
    worksheet.getRow((1).toString()).getCell('D').font = {           name: 'Arial', size: 12};
    worksheet.getRow((1).toString()).getCell('E').font = {           name: 'Arial', size: 12};
    worksheet.getRow((1).toString()).getCell('F').font = {           name: 'Arial', size: 12};

    worksheet.getRow((1).toString()).getCell('A').border = cellborderStyles1
    worksheet.getRow((1).toString()).getCell('B').border = cellborderStyles1
    worksheet.getRow((1).toString()).getCell('C').border = cellborderStyles1
    worksheet.getRow((1).toString()).getCell('D').border = cellborderStyles1
    worksheet.getRow((1).toString()).getCell('E').border = cellborderStyles1
    worksheet.getRow((1).toString()).getCell('F').border = cellborderStyles1

    worksheet.getRow((1).toString()).getCell('A').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((1).toString()).getCell('B').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((1).toString()).getCell('C').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((1).toString()).getCell('D').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((1).toString()).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow((1).toString()).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    array.forEach((element,i) => {
      worksheet.getRow((2+i).toString()).getCell('A').value = i+1;
      worksheet.getRow((2+i).toString()).getCell('B').value = array[i].material
      worksheet.getRow((2+i).toString()).getCell('C').value = array[i].desc
      worksheet.getRow((2+i).toString()).getCell('D').value = array[i].type
      worksheet.getRow((2+i).toString()).getCell('E').value = array[i].total
      worksheet.getRow((2+i).toString()).getCell('F').value = array[i].remaining

      worksheet.getRow((2+i).toString()).getCell('A').font = {          name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('B').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('C').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('D').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('E').font = {           name: 'Arial', size: 10};
      worksheet.getRow((2+i).toString()).getCell('F').font = {           name: 'Arial', size: 10};

      worksheet.getRow((2+i).toString()).getCell('A').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('B').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('C').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('D').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('E').border = cellborderStyles
      worksheet.getRow((2+i).toString()).getCell('F').border = cellborderStyles

      worksheet.getRow((2+i).toString()).getCell('A').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('B').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('C').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('D').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getRow((2+i).toString()).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
    return(await workbook);
  }



async function f1(collection1,query1)
{   var b=[]
    const client = await MongoClient.connect(url, { useNewUrlParser: true })      
    if (!client) {
        return;
    }
    try {
        const db = client.db("sdf_project_ver2");
        let collection = db.collection(collection1);
        let query = query1
        let res = await collection.find(query).toArray();
        return(res)
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}


router.post('/', (req,res100) => {
    console.log('RO excel')
    var query={},query1={}
    var collection1,array=[]
    if(req.body.Section=='engine')
    {   query.type="ENGINE" ;
        collection1= "sap_trans"; 
        req.body.Part_no!=''?query.material=req.body.material.trim():'';
        req.body.Remaining=='no'?query.remaining=0:''
        req.body.Remaining=='yes'?query.remaining={$ne: 0}:''
        boxlistpromise= f1(collection1,query)

    }

    else if(req.body.Section=='transmission')
    {   query.type="TRANSMISSION";  
        collection1= "sap_trans"; 
        req.body.Part_no!=''?query.material=req.body.material.trim():'';
        req.body.Remaining=='no'?query.remaining=0:''
        req.body.Remaining=='yes'?query.remaining={$ne: 0}:''
        boxlistpromise= f1(collection1,query)

    }

    else if(req.body.Section=='other-parts')
    {   query.type={$nin : ["TRANSMISSION", "ENGINE",'CO','All_pages']}  
        collection1= "sap_trans"; 
        req.body.Part_no!=''?query.material=req.body.material.trim():'';
        req.body.Remaining=='no'?query.remaining=0:''
        req.body.Remaining=='yes'?query.remaining={$ne: 0}:''
        boxlistpromise= f1(collection1,query)

    }  

    else if(req.body.Section=='CO')
    {  
        collection1= "sap_cos"; 
        req.body.Part_no!=''?query.pno=req.body.Part_no.trim():'';
        req.body.Remaining=='no'?query.remaining1=0:''
        req.body.Remaining=='yes'?query.remaining1={$ne: 0}:''
        boxlistpromise= f1(collection1,query)
    }   

    else if(req.body.Section=='All_pages')
    {  
        collection1= "sap_cos"; 
        req.body.Part_no!=''?query.pno=req.body.Part_no.trim():'';
        req.body.Remaining=='no'?query.remaining1=0:''
        req.body.Remaining=='yes'?query.remaining1={$ne: 0}:''
        boxlistpromise= f1(collection1,query)
        collection2= "sap_trans"; 
        req.body.Part_no!=''?query1.material=req.body.material.trim():'';
        req.body.Remaining=='no'?query1.remaining=0:''
        req.body.Remaining=='yes'?query1.remaining={$ne: 0}:''
        boxlistpromise1= f1(collection2,query1)
        boxlistpromise1.then(function(result432){ 
            array=result432
        }) 
    }   

    boxlistpromise.then(function(result){     
        if(req.body.Section=='CO' || req.body.Section=='All_pages')
        {
            var result=result.map((element,index)=>
            {
                element["material"]=element.pno
                element["remaining"]=element.remaining1 
                element["type"]='CO' 
                return(element)
            })
        }
        if(req.body.Section=='All_pages')
        {
            array.forEach(element => {
                result.push(element)
            });
        }
        var workbook= excelOp(result)
        workbook.then(function(result2){     
            res100.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
            res100.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res100.setHeader("Content-Disposition", "attachment; filename=" +`${req.body.Section}.xlsx`);
            return result2.xlsx.write(res100)
               .then(function(){
                res100.end();
               });
        })       
    })

})

module.exports = router
