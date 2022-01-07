from json.encoder import JSONEncoder
from fastapi import FastAPI
import uvicorn
import json
import csv
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    today = date.today()
    date31 =today.strftime("%d-%m-%Y")
    r="C:/Users/kirshnan/Desktop/"+date31+'.csv'    
    try:
        file = open(r)
        csvreader = csv.reader(file)
        array = list(csvreader)
        array=array[::-1]
        for row in array:
                if(row[0]!=''):                        
                    return(row)   
    except:
        return("File does not exists") 
   
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9876)
