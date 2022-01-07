const express=require('express')
const router=express.Router()
var config = require('../config');
const url = config.url
var MongoClient = require('mongodb').MongoClient;



router.post('/', async (req,res) => {
  var CO_rem_count=0, CO_total=0

  var engine_rem_count=0, engine_total=0
  var transmission_rem_count=0, transmission_total=0
  var otherparts_rem_count=0, otherparts_total=0

    const client = await MongoClient.connect(url, { useNewUrlParser: true })

    try {
        const db = client.db("sdf_project_ver2");
        let collection = db.collection('sap_trans');
        let res = await collection.find().toArray();
        let collection1 = db.collection('sap_cos');
        let res1 = await collection1.find().toArray();
        res.map((element,index)=>{
          if(element.type=='ENGINE')
          { 
            engine_rem_count+=element.remaining;
            engine_total+=+(element.total);          
          }
          else if(element.type=='TRANSMISSION')
          { 
            transmission_rem_count+=element.remaining;
            transmission_total+=+(element.total);          
          }
          else 
          { 
            otherparts_rem_count+=element.remaining;
            otherparts_total+=+(element.total);          
          }
        })
        res1.map((element,index)=>{
          CO_total+=+(element.total); 
          CO_rem_count+=element.remaining1;
        })
    } 
    catch (err) {
        console.log('err')
        return res.json('Error in DB')
    } 
    finally {
        client.close();
    }

    return res.json({'All_remaing':CO_rem_count+transmission_rem_count+otherparts_rem_count+engine_rem_count,
    'All_Total':CO_total+transmission_total+engine_total+otherparts_total,
    'CO_rem_count':CO_rem_count,'CO_total':CO_total,'engine_rem_count':engine_rem_count,'engine_total':engine_total,
    'transmission_rem_count':transmission_rem_count,'transmission_total':transmission_total,'otherparts_rem_count':otherparts_rem_count,'otherparts_total':otherparts_total})


})


router.post('/date', async (req,res) => {
    console.log('chart-date '+req.body.part)
      const client = await MongoClient.connect(url, { useNewUrlParser: true })
      var count=[],date100=[]
        var date=new Date()
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        const db = client.db("sdf_project_ver2");
        var k=[0,1,2,3,4,5,6]
        var output=[]
        var output1=[]

       let collection = db.collection(req.body.part);
        let res432
        for await (let i of k)
        {
          var start =new Date(year,month,day-6+i)
          var stop=new Date(year,month,day-5+i)
          start.setHours( start.getHours() + 5);
          stop.setHours( stop.getHours() + 5);
          start.setMinutes( start.getMinutes() + 30);
          stop.setMinutes( stop.getMinutes() + 30);  
          res432 =  collection.aggregate(
            [
              {
                $match: {
                  Datenow: {
                    $gte: start  ,
                    $lt: stop
                  }
                }
              },
              {
                $count: "passing_scores"
              }
            ]	  
           
          )
          for await (const doc of res432) {
            count.push(doc.passing_scores);
            date100.push(start)        
            console.log(count)

            if(i==6)
              {              console.log(date100)

                 res.json({"count":count,"date": date100})
              }           
            }           
         }
        
  })


// router.post('/date', async (req,res) => {

//     const client = await MongoClient.connect(url, { useNewUrlParser: true })
//     var count=[],date100=[]
//       var date=new Date()
//       let day = date.getDate();
//       let month = date.getMonth();
//       let year = date.getFullYear();
//       const db = client.db("sdf_project_ver2");
//       var k=[0,1,2,3,4,5,6]
//       var list=["engines","transmissions"]
//       var output=[]
//     for (let j=0;j<2;j++)
//     { let collection = db.collection(list[j]);
//       let res432
//       for await (let i of k)
//       { console.log(i)
       
//         var start =new Date(year,month,day-6+i)
//         var stop=new Date(year,month,day-5+i)
//         start.setHours( start.getHours() + 5);
//         stop.setHours( stop.getHours() + 5);
//         start.setMinutes( start.getMinutes() + 30);
//         stop.setMinutes( stop.getMinutes() + 30);

//         res432 =  collection.aggregate(
//           [
//             {
//               $match: {
//                 Datenow: {
//                   $gte: start  ,
//                   $lt: stop
//                 }
//               }
//             },
//             {
//               $count: "passing_scores"
//             }
//           ]
//         )
//           console.log(Object.keys(res432))
       
//       }
//       for await (const doc of res432) {
//         console.log(doc)
//             count.push(doc.passing_scores);
//             date100.push(start)
       
            
//               output.push({"list":list[j],"count":count,"date": date100})
          
//        }
//     }  
//     setTimeout(() => {
//       res.json(output)
//     }, 2000);
// })
module.exports = router;
