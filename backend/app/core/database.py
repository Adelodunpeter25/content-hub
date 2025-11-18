from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import contextmanager
from app.core.config import Config

# Create base class for models
Base = declarative_base()

# Database engine
engine = None
SessionLocal = None

def init_db():
    """Initialize database engine and session"""
    global engine, SessionLocal
    
    if not Config.DATABASE_URL:
        raise ValueError("DATABASE_URL not configured")
    
    engine = create_engine(
        Config.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=20,
        max_overflow=10,
        pool_recycle=3600,
        pool_timeout=30,
        connect_args={
            'sslmode': 'require',
            'connect_timeout': 10,
            'keepalives': 1,
            'keepalives_idle': 30,
            'keepalives_interval': 10,
            'keepalives_count': 5
        }
    )
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    return engine

def get_engine():
    """Get database engine"""
    global engine
    
    if engine is None:
        init_db()
    
    return engine

def get_session():
    """Get database session"""
    global SessionLocal
    
    if SessionLocal is None:
        init_db()
    
    return SessionLocal()

@contextmanager
def get_db():
    """
    Context manager for database sessions with proper error handling
    
    Usage:
        with get_db() as db:
            user = db.query(User).filter(User.email == email).first()
    """
    db = get_session()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def cleanup_connections():
    """Cleanup database connections for background jobs"""
    global engine
    if engine:
        engine.dispose()

def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=get_engine())
