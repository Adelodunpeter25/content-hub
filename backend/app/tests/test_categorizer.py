import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.utils.categorizer import categorize_article, add_categories_to_articles

class TestCategorizer(unittest.TestCase):
    
    def test_ai_category(self):
        """Test AI categorization"""
        categories = categorize_article("OpenAI releases new GPT model", "")
        self.assertIn('AI', categories)
    
    def test_security_category(self):
        """Test Security categorization"""
        categories = categorize_article("Major security breach at tech company", "")
        self.assertIn('Security', categories)
    
    def test_multiple_categories(self):
        """Test article with multiple categories"""
        categories = categorize_article(
            "AI security vulnerability discovered",
            "Machine learning model has security flaw"
        )
        self.assertIn('AI', categories)
        self.assertIn('Security', categories)
    
    def test_general_category(self):
        """Test general category for unmatched articles"""
        categories = categorize_article("Random news article", "")
        self.assertEqual(categories, ['General'])
    
    def test_add_categories_to_articles(self):
        """Test adding categories to article list"""
        articles = [
            {'title': 'AI breakthrough', 'summary': ''},
            {'title': 'Security update', 'summary': ''}
        ]
        result = add_categories_to_articles(articles)
        self.assertIn('AI', result[0]['categories'])
        self.assertIn('Security', result[1]['categories'])

if __name__ == '__main__':
    unittest.main()
