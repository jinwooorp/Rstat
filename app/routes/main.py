from fastapi import FastAPI
from app.database import engine, Base
from app.routes import api, web


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api.router)
app.include_router(web.router)
