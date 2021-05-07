import re
import datetime
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
from utils.airbnb_scraper import *
from utils.amazon_scraper import *


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

    querys = db.relationship("Query", backref="user")

    def __repr__(self):
        return f'<User {self.username}>'


class Query(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.Text)
    origin_text = db.Column(db.Text, nullable=False)
    best_result = db.Column(db.String(25), nullable=False)
    detailed_result = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def __repr__(self):
        return f'<Query {self.title}>'


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

        access_token = create_access_token(identity={"email": data["email"], "username": data["username"]})
        return jsonify({
            "msg": f"Compte de {data['username']} créé avec succés",
            "access_token": access_token,
        }), 200


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = json.loads(request.data)

        user = User.query.filter_by(email=data["email"], password=hash_password(data["password"])).first()
        if user == None:
            return jsonify({"msg": "Email ou mot de passe incorrect"}), 401

        access_token = create_access_token(identity={"email": user.email, "username": user.username})
        return jsonify({
            "msg": f"{user.username} : vous êtes bien connecté",
            "access_token" : access_token,
        })


# TODO A supprimer après tests
# @app.route("/login", methods=["POST"])
# def login():
#     if request.method == "POST":
#         data = json.loads(request.data)

#         users = User.query.filter_by(email=data["email"], password=hash_password(data["password"])).all()
#         if len(users) == 0:
#             return jsonify({"msg": "Email ou mot de passe incorrect"}), 401
#         # Ne devrait jamais se déclencher
#         if len(users) > 1:
#             return jsonify({"msg": "Erreur !!"}), 400

#         user = users[0]
#         access_token = create_access_token(identity={"email": user.email, "username": user.username})
#         return jsonify({
#             "msg": f"{user.username} : vous êtes bien connecté",
#             "access_token" : access_token,
#         })
    

@app.route("/parse_text", methods=["POST"])
@jwt_required()
@cross_origin()
def parse_text():
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


@app.route("/parse_url", methods=["POST"])
@jwt_required()
# @cross_origin()
def parse_url():
    if request.method == "POST":
        data = json.loads(request.data)

        # Control URL and redirect to the good scraper
        if data["url"][:19] not in ["https://www.airbnb.", "https://www.amazon."]:
            return jsonify({"msg": "Adresse incorrecte !"}), 403

        if data["url"][:19] == "https://www.airbnb.":
            all_comments_str, title = airbnb_scraper(data["url"])
        elif data["url"][:19] == "https://www.amazon.":
            all_comments_str, title = amazon_scraper(data["url"])

        # Translation of the reviews       
        translated_comments = preprocess.translate(all_comments_str)
        translated_comments = translated_comments.split("<END>")

        all_comments_list = all_comments_str.split("<END>")


        # TODO Try to debug translation when are multi languages
        for com, trans in zip(all_comments_list, translated_comments):
            print("ORIGINAL >>> \n", com)
            print("TRANSLATION >>> \n", trans)
            print("========================================================================")
        print("TEXT >>> \n", all_comments_str[:500], type(all_comments_str))
        print("> ========================================================================")
        print(">> =======================================================================")



        tokens_list = preprocess.tokenize(translated_comments)
        preds_list = model.predict(tokens_list)

        best_result = model.best_result(preds_list)
        detailed_results = model.detailed_results(preds_list, all_comments_list)

        # Insertion in db
        user = User.query.filter_by(username=get_jwt_identity()["username"]).first()
        query = Query(
            title=title,
            url=data["url"],
            origin_text=all_comments_str[:500],
            best_result=best_result,
            detailed_result=json.dumps(detailed_results),
            user=user
        )
        db.session.add(query)
        db.session.commit()

        data = {
            "title": title,
            "url": data["url"],
            "best_result": str(best_result),
            "detailed_results": detailed_results,
            "original_text": all_comments_str,
            "translated_text": translated_comments,
            "phrases": all_comments_list,
            "sents": translated_comments,
        }
        return {"data": data}
    
    return {"data": "Erreur"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
