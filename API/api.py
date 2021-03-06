import re
import datetime
import emoji
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
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from utils import config
from utils.classes import *
from utils.functions import *
from utils.airbnb_scraper import *
from utils.amazon_scraper import *


# =============================
#          CONFIG
# =============================
sentry_sdk.init(
    dsn="https://b94402c3a7d7499784abf207786ccd40@o571413.ingest.sentry.io/5780931",
    integrations=[FlaskIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0
)

app = Flask(__name__)

cors = CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@database/emotion_detector_db'
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY
JWTTimeDelta = datetime.timedelta(days=1)


# =============================
#          ENTITIES
# =============================
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
    best_result = db.Column(db.String(25), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    results = db.relationship("Result", backref="query")

    def __repr__(self):
        return f'<Query {self.title}>'


class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.Text, nullable=False)
    score = db.Column(db.String(255), nullable=False)
    query_id = db.Column(db.Integer, db.ForeignKey("query.id"))

    def __repr__(self):
        return f'<Result {self.review}>'


preprocess = Preprocess()
model = Model()


# =============================
#          ROUTES
# =============================
# Test Sentry
@app.route('/debug-sentry')
def trigger_error():
    division_by_zero = 1 / 0


@app.route("/join", methods=["POST"])
@cross_origin()
def join():
    if request.method == "POST":
        data = json.loads(request.data)

        # Control if user's data already exist
        old_username = User.query.filter_by(username=data["username"]).all()
        old_email = User.query.filter_by(email=data["email"]).all()
        if len(old_username) > 0 or len(old_email) > 0:
            return jsonify({"msg": "Erreur ce nom ou cet email ??xiste d??j?? !"}), 403

        # Insert user's data in database
        user = User(
            username=data["username"], 
            email=data["email"],
            password=hash_password(data["password"])
        )
        db.session.add(user)
        db.session.commit()

        # Generate a Token
        access_token = create_access_token(expires_delta=JWTTimeDelta, identity={"email": data["email"], "username": data["username"]})
        return jsonify({
            "msg": f"Compte de {data['username']} cr???? avec succ??s",
            "access_token": access_token,
        }), 200


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = json.loads(request.data)

        # Search the user in DB
        user = User.query.filter_by(email=data["email"], password=hash_password(data["password"])).first()
        if user == None:
            return jsonify({"msg": "Email ou mot de passe incorrect"}), 401

        access_token = create_access_token(expires_delta=JWTTimeDelta, identity={"email": user.email, "username": user.username})
        return jsonify({
            "msg": f"{user.username} : vous ??tes bien connect??",
            "access_token" : access_token,
        })


@app.route("/account", methods=["GET"])
@jwt_required()
def account():
    if request.method == "GET":
        user = User.query.filter_by(username=get_jwt_identity()["username"]).first()
        all_queries = Query.query.filter_by(user=user).all()

        queries = {}
        i = 0
        for query in all_queries:
            queries[i] = {}
            queries[i]["id"] = query.id
            queries[i]["title"] = query.title
            queries[i]["url"] = query.url
            queries[i]["emotion"] = query.best_result
            queries[i]["date"] = query.created_at
            i += 1

        return jsonify({
            "user": user.username,
            "queries": queries,
        })


@app.route("/detail/<query_id>", methods=["GET"])
@jwt_required()
@cross_origin()
def detail(query_id):
    user = User.query.filter_by(username=get_jwt_identity()["username"]).first()
    query = Query.query.filter_by(user=user, id=int(query_id)).first()

    return jsonify({
        "user": user.username,
        "query": query.title,
        "url": query.url,
        "phrases": [r.review for r in query.results],
        "detailed_result": {r.review: json.loads(r.score) for r in query.results},
    })


@app.route("/delete/<query_id>", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete(query_id):
    user = User.query.filter_by(username=get_jwt_identity()["username"]).first()
    query = Query.query.filter_by(user=user, id=int(query_id)).first()

    for result in query.results:
        db.session.delete(result)

    db.session.delete(query)
    db.session.commit()

    return jsonify({
        "msg": "Requ??te supprim??e !"
    }), 200


@app.route("/parse_text", methods=["POST"])
@jwt_required(optional=True)
def parse_text():
    if request.method == "POST": 
        original_text = request.data
        original_text = json.loads(original_text)
        clean_text = preprocess.clean(original_text["text"])
        phrases = re.split(r"[.|;|!|\?|\n]", clean_text)
        sents = preprocess.translate(phrases)
        if "" in sents:
            sents.remove("")

        tokens_list = preprocess.tokenize(sents)
        preds_list = model.predict(tokens_list)

        best_result = model.best_result(preds_list)
        detailed_results = model.detailed_results(preds_list, phrases)

        # If user is logged
        if get_jwt_identity():
            # Insertion in db
            user = User.query.filter_by(username=get_jwt_identity()["username"]).first()
            if len(clean_text) > 200:
                title = clean_text[:200]
            else:
                title = clean_text

            query = Query(
                title=title,
                best_result=best_result,
                user=user
            )
            db.session.add(query)

            for review, score in detailed_results.items():
                result = Result(
                    review=emoji.demojize(review),
                    score=json.dumps(score),
                    query=query
                )
                db.session.add(result)
            db.session.commit()

        data = {
            "best_result": str(best_result),
            "original_text": str(original_text["text"]),
            "translated_text": ". ".join(sents),
            "phrases": phrases,
            "sents": sents,
            "detailed_results": detailed_results,
        }
        return {"data": data}

    return {"data": "Erreur"}


@app.route("/parse_url", methods=["POST"])
@jwt_required(optional=True)
def parse_url():
    if request.method == "POST":
        data = json.loads(request.data)

        # Control URL and redirect to the good scraper
        if data["url"][:19] not in ["https://www.airbnb.", "https://www.amazon."]:
            return jsonify({"msg": "Adresse incorrecte !"}), 403

        if data["url"][:19] == "https://www.airbnb.":
            all_comments_list, title = airbnb_scraper(data["url"])
        elif data["url"][:19] == "https://www.amazon.":
            all_comments_list, title = amazon_scraper(data["url"])

        # Translation of the reviews       
        translated_comments = preprocess.translate(all_comments_list)

        tokens_list = preprocess.tokenize(translated_comments)
        preds_list = model.predict(tokens_list)

        best_result = model.best_result(preds_list)
        detailed_results = model.detailed_results(preds_list, all_comments_list)

        # If user is logged
        if get_jwt_identity():
            # Insertion in db
            user = User.query.filter_by(username=get_jwt_identity()["username"]).first()
            query = Query(
                title=title,
                url=data["url"],
                best_result=best_result,
                user=user
            )
            db.session.add(query)

            for review, score in detailed_results.items():
                result = Result(
                    review=emoji.demojize(review),
                    score=json.dumps(score),
                    query=query
                )
                db.session.add(result)
            db.session.commit()

        data = {
            "title": title,
            "url": data["url"],
            "best_result": str(best_result),
            "detailed_results": detailed_results,
            "translated_text": translated_comments,
            "phrases": all_comments_list,
            "sents": translated_comments,
        }
        return {"data": data}
    
    return {"data": "Erreur"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
