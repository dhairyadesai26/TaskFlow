from flask  import Flask
from flask_cors import CORS

from routes.tasks import task_bp
from routes.users import user_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(task_bp)
app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run(debug=True)