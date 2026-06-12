from fastapi import FastAPI
from sqlalchemy import text

from database import SessionFactory


app = FastAPI()

@app.get("/")
def root_handler():
    return {"ping": "pong"}

@app.get("/users")
def get_users_handler():
    with SessionFactory() as session:
        stmt = text("SELECT * FROM user;")
        rows = session.execute(stmt).fetchall()
        users = [row._asdict() for row in rows]
    return {"users": users}