import os
from dotenv import load_dotenv
import redis

load_dotenv()

redis_url = os.getenv('REDIS_URL')
print(f"Connecting to: {redis_url}")

try:
    client = redis.from_url(redis_url, decode_responses=True, socket_connect_timeout=5)
    client.ping()
    print("✓ Connected successfully!")
    
    # Test set/get
    client.set('test_key', 'test_value')
    value = client.get('test_key')
    print(f"✓ Set/Get test: {value}")
    
    client.delete('test_key')
    print("✓ All tests passed!")
    
except Exception as e:
    print(f"✗ Connection failed: {e}")
