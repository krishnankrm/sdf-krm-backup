var Excel = require('exceljs');

async function f1()
{   
    var b=[]
    var d1=new Promise(async (resovlve,req)=>{
        let workbook = new Excel.Workbook();
        workbook = await workbook.xlsx.readFile('//DESKTOP-BHKMHL0/Users/Balaji/Desktop/sap/32.xlsx'); 
        let worksheet = workbook.getWorksheet('I6');
        const c1 = worksheet.getColumn(3);
        c1.eachCell(c => {
        b.push(c.value);
        });
        setTimeout(() => {
            resovlve(1)
        }, 2000);
    })
    let d2=await d1
    console.log(b)

// const newWorkbook = new Excel.Workbook();
// const worksheet = newWorkbook.addWorksheet('ExampleSheet');

// worksheet.addRow(1);

// b.forEach((element,index) => {
//     worksheet.getRow((index).toString()).getCell('E').value =element; 
// });


// await newWorkbook.xlsx.writeFile('//DESKTOP-BHKMHL0/Users/Balaji/Desktop/sap/export324.xlsx');

}
f1()