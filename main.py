from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import FileResponse

from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from sqlalchemy import func

from database import SessionLocal
from database import engine

from sensor import SensorData
from database import Base


app = FastAPI()

Base.metadata.create_all(
    bind=engine
)

class SensorInput(BaseModel): # 데이터 폼
    
    temp : float
    humid : float

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name = "static"
) # /static 연결
    
@app.get("/")
def home():
    return FileResponse(
        "static/index.html"
    )
    
@app.post("/sensor") # 온습도 데이터 받기
def receive_sensor(data:SensorInput):
    
    db = SessionLocal()
    
    sensor = SensorData(
        temp = data.temp,
        humid = data.humid
    )
    
    db.add(sensor)
    db.commit()
    db.close()
    
    return {"result" : "ok" }

@app.get("/average") # 온습도 평균계산
def average():
    db = SessionLocal()
    
    temp = db.query(
        func.avg(
            SensorData.temp
        )
    ).scalar()
    
    humid = db.query(
        func.avg(
            SensorData.humid
        )
    ).scalar()
    
    db.close()
    
    return {
        "temperature": round(temp,2),
        "humidity": round(humid,2)
    }
    
from sqlalchemy import select


@app.get("/sensor") # 온도, 습도 출력
def get_sensor():

    db = SessionLocal()

    data = db.query(
        SensorData
    ).all()

    result = []

    for item in data:

        result.append(
            {
                "id": item.id,
                "temp": item.temp,
                "humid": item.humid,
                "created": item.created.strftime("%Y-%m-%d %H:%M:%S")
            }
        )

    db.close()

    return result
