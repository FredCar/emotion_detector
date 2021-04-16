import re
from flask import Flask, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
import tensorflow as tf
from transformers import TFBertForSequenceClassification
from transformers import BertTokenizer
from utils import config
from utils.functions import *


app = Flask(__name__)


cors = CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)


app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@database/emotion_detector_db'
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

preprocess = Preprocess()
model = Model()


@app.route("/", methods=["GET"])
@cross_origin()
def home():
    if request.method == "GET":
        # res = User.query.all()
        return {"message": ">>> GET <<<"}


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)


# @app.route("/token", methods=["POST"])
# def create_token():

#     response_body = {
#         "message": "création de token"
#     }

#     return jsonify(response_body), 200

    

@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    if request.method == "POST": 
        original_text = request.data
        original_text = json.loads(original_text)
        phrases = re.split(r"[.|;|!|\?|\n]", original_text["text"])
        translated_text = preprocess.translate(original_text["text"])
        sents = re.split(r"[.|;|!|\?|\n]", translated_text)

        tokens_list = preprocess.tokenize(sents)
        preds_list = model.predict(tokens_list)

        best_result = model.best_result(preds_list)
        detailed_results = model.detailed_results(preds_list, phrases)

        data = {
            "best_result": str(best_result),
            "original_text": str(original_text["text"]),
            "translated_text": str(translated_text),
            "phrases": phrases,
            "sents": sents,
            "detailed_results": detailed_results,
        }

        return {"data": data}

    return {"data": "Erreur"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)