from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./fastapi.db"

# 프로그래밍적으로 데이터베이스 연결을 관리
engine = create_engine(DATABASE_URL, echo=True)

# 세션: 데이터베이스 작업 단위
SessionFactory = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

def get_session():
    session = SessionFactory()
    try:
        yield session
    finally:
        session.close()