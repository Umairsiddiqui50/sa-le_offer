
from flask import Flask
from flask_cors import CORS
from database import db
from config import Config
from data.seed import seed_database
from routes.api import api_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

app.register_blueprint(api_bp)

if __name__ == '__main__':
    seed_database(app)
    app.run(port=8000, debug=True)
