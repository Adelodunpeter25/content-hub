from flask import jsonify

class APIError(Exception):
    """Base API error class"""
    status_code = 500
    
    def __init__(self, message, status_code=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
    
    def to_dict(self):
        return {'error': self.message}

class NotFoundError(APIError):
    """404 Not Found error"""
    status_code = 404

class BadRequestError(APIError):
    """400 Bad Request error"""
    status_code = 400

class InternalServerError(APIError):
    """500 Internal Server error"""
    status_code = 500

def register_error_handlers(app):
    """Register error handlers with Flask app"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.error(f'Unexpected error: {str(error)}')
        return jsonify({'error': 'An unexpected error occurred'}), 500
