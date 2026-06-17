from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import DateTime
from datetime import datetime

from database import Base


class SensorData(Base):
    __tablename__ = "sensor"
    
    id = Column(
        Integer,
        primary_key=True
    )
    
    temp = Column(Float)
    humid = Column(Float)
    created = Column(DateTime, default=datetime.now)
    