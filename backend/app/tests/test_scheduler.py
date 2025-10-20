import unittest
import sys
import os
import time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.scheduler import init_scheduler, shutdown_scheduler, fetch_feeds_job
from app.core.cache import cache_get, cache_delete

class TestScheduler(unittest.TestCase):
    
    def setUp(self):
        """Setup before each test"""
        cache_delete('feeds:all')
        shutdown_scheduler()
    
    def tearDown(self):
        """Cleanup after each test"""
        shutdown_scheduler()
    
    def test_init_scheduler(self):
        """Test scheduler initialization"""
        scheduler = init_scheduler()
        self.assertIsNotNone(scheduler)
        self.assertTrue(scheduler.running)
        shutdown_scheduler()
    
    def test_scheduler_singleton(self):
        """Test that init_scheduler returns same instance"""
        scheduler1 = init_scheduler()
        scheduler2 = init_scheduler()
        self.assertEqual(scheduler1, scheduler2)
        shutdown_scheduler()
    
    def test_fetch_feeds_job(self):
        """Test that fetch_feeds_job populates cache"""
        # Clear cache
        cache_delete('feeds:all')
        
        # Run job
        fetch_feeds_job()
        
        # Check cache is populated
        cached = cache_get('feeds:all')
        self.assertIsNotNone(cached)
        self.assertIsInstance(cached, list)
    
    def test_fetch_feeds_job_error_handling(self):
        """Test that job handles errors gracefully"""
        # Job should not raise exceptions
        try:
            fetch_feeds_job()
            success = True
        except Exception:
            success = False
        
        self.assertTrue(success)
    
    def test_scheduler_runs_job_on_startup(self):
        """Test that scheduler runs job immediately on startup"""
        cache_delete('feeds:all')
        
        # Start scheduler
        scheduler = init_scheduler()
        
        # Wait for startup job to complete
        time.sleep(12)
        
        # Check cache is populated
        cached = cache_get('feeds:all')
        self.assertIsNotNone(cached, "Cache should be populated after startup job")
        
        if scheduler.running:
            shutdown_scheduler()
    
    def test_scheduler_has_jobs(self):
        """Test that scheduler has configured jobs"""
        scheduler = init_scheduler()
        
        # Wait a moment for jobs to be scheduled
        time.sleep(1)
        
        jobs = scheduler.get_jobs()
        self.assertGreaterEqual(len(jobs), 1)
        
        # Check for fetch_feeds job
        job_ids = [job.id for job in jobs]
        self.assertIn('fetch_feeds', job_ids)
        
        shutdown_scheduler()
    
    def test_shutdown_scheduler(self):
        """Test scheduler shutdown"""
        scheduler = init_scheduler()
        
        # Wait for scheduler to fully start
        time.sleep(1)
        
        if scheduler.running:
            shutdown_scheduler()
            self.assertFalse(scheduler.running)
        else:
            self.skipTest("Scheduler not running")

if __name__ == '__main__':
    unittest.main()
