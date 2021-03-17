from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from utils import config

app = Flask(__name__)


cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@database/code_generator_db'


@app.route("/", methods=["GET"])
@cross_origin()
def home():
    return jsonify(message = "Hello World !!")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)