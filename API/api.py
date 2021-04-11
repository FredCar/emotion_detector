import re
from flask import Flask, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import tensorflow as tf
from transformers import TFBertForSequenceClassification
from transformers import BertTokenizer
from utils import config
from utils.functions import *


app = Flask(__name__)


cors = CORS(app)
db = SQLAlchemy(app)


app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@database/emotion_detector_db'


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
    

@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    if request.method == "POST": 
        original_text = request.data
        original_text = json.loads(original_text)
        translated_text = preprocess.translate(original_text["text"])
        sents = re.split(r"[.|;|!|\?|\n]", translated_text)

        tokens_list = preprocess.tokenize(sents)
        preds_list = model.predict(tokens_list)

        best_result = model.best_result(preds_list)
        all_results = model.all_results(preds_list)

        data = {
            "best_result": str(best_result),
            "original_text": str(original_text["text"]),
            "translated_text": str(translated_text),
            "sents": sents,
            "all_results": all_results,
        }

        return {"data": data}

    return {"data": "Erreur"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)