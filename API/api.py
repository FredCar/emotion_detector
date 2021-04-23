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
from utils.classes import *
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
    password = db.Column(db.String(120), nullable=False)

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


@app.route("/join", methods=["POST"])
@cross_origin()
def join():
    if request.method == "POST":
        data = json.loads(request.data)

        # Control if user's data already exist
        old_username = User.query.filter_by(username=data["username"]).all()
        old_email = User.query.filter_by(email=data["email"]).all()
        if len(old_username) > 0 or len(old_email) > 0:
            return jsonify({"msg": "Erreur ce nom ou cet email éxiste déjà !"}), 403

        # Insert user's data in database
        user = User(
            username=data["username"], 
            email=data["email"],
            password=hash_password(data["password"])
        )
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=data["email"])
        return jsonify({
            "msg": f"Compte de {data['username']} créé avec succés",
            "access_token": access_token,
        }), 200


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = json.loads(request.data)

        users = User.query.filter_by(email=data["email"], password=hash_password(data["password"])).all()
        print(type(users), users)
        if len(users) == 0:
            return jsonify({"msg": "Email ou mot de passe incorrect"}), 401
        # Ne devrait jamais se déclencher
        if len(users) > 1:
            return jsonify({"msg": "Erreur !!"}), 400

        user = users[0]
        access_token = create_access_token(identity={"email": user.email, "username": user.username})
        return jsonify({
            "msg": f"{user.username} : vous êtes bien connecté",
            "access_token" : access_token,
        })
    

@app.route("/predict", methods=["POST"])
@jwt_required()
@cross_origin()
def predict():
    print("jwt identity >>>   ", get_jwt_identity())
    if request.method == "POST": 
        original_text = request.data
        original_text = json.loads(original_text)
        clean_text = preprocess.clean(original_text["text"])
        phrases = re.split(r"[.|;|!|\?|\n]", clean_text)
        translated_text = preprocess.translate(clean_text)
        sents = re.split(r"[.|;|!|\?|\n]", translated_text)
        if "" in sents:
            sents.remove("")

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