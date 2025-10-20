from flask import Flask, jsonify, send_from_directory
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from app.core.config import Config
from app.core.errors import register_error_handlers
from app.core.logging_config import setup_logging
from app.core.oauth import init_oauth
from app.core.cache import init_cache
from app.core.scheduler import init_scheduler, shutdown_scheduler
import atexit

# import blueprints
from app.routes import rss, scrape, feeds, users, social, auth, bookmarks, read_history, recommendations, trending, stats

# Initialize Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Setup logging
setup_logging(app)

# Initialize OAuth
init_oauth(app)

# Initialize cache
init_cache()

# Initialize background scheduler
init_scheduler()

# Shutdown scheduler on app exit
atexit.register(shutdown_scheduler)

# Register error handlers
register_error_handlers(app)

# Home route - shows API is running
@app.route('/')
def home():
    return jsonify({
        'message': 'Content Hub API',
        'version': '0.1.0'
    })

# Health check endpoint
@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

# Swagger UI configuration
SWAGGER_URL = '/docs'
API_URL = '/swagger.json'

documentation = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Content Hub API"}
)

@app.route('/swagger.json')
def swagger_spec():
    return send_from_directory('.', 'swagger.json')

# Register blueprints
app.register_blueprint(documentation)
app.register_blueprint(auth.bp)
app.register_blueprint(rss.bp)
app.register_blueprint(scrape.bp)
app.register_blueprint(feeds.bp)
app.register_blueprint(users.bp)
app.register_blueprint(social.bp)
app.register_blueprint(bookmarks.bp)
app.register_blueprint(read_history.bp)
app.register_blueprint(recommendations.bp)
app.register_blueprint(trending.bp)
app.register_blueprint(stats.bp)

# Run the app
if __name__ == '__main__':
    app.logger.info('Starting Content Hub API on port 5000')
    app.run(debug=app.config['DEBUG'], port=5000)
