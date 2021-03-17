from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from utils import config


app = Flask(__name__)


cors = CORS(app)
db = SQLAlchemy(app)


app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@database/code_generator_db'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


@app.route("/", methods=["GET"])
@cross_origin()
def home():
    res = User.query.all()
    return {"message": str(res[0])}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)