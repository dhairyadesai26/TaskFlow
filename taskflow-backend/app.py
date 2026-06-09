import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from routes.tasks import task_bp
from routes.users import user_bp

app = Flask(__name__)

frontend_url = os.getenv("FRONTEND_URL", "*")
CORS(app, origins=[frontend_url] if frontend_url != "*" else "*")

app.register_blueprint(task_bp)
app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run(debug=True)