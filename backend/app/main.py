from flask import Flask, jsonify
from app.core.config import Config

# import blueprints
from app.routes import rss, scrape, feeds

# Initialize Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Home route - shows API is running
@app.route('/')
def home():
    return jsonify({
        'message': 'Content Hub API',
        'version': '0.1.0',
        'endpoints': {
            'rss': '/api/rss',
            'scrape': '/api/scrape',
            'feeds': '/api/feeds'
        }
    })

# Health check endpoint
@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

# Register blueprints
app.register_blueprint(rss.bp)
app.register_blueprint(scrape.bp)
app.register_blueprint(feeds.bp)

# Run the app
if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=5000)
