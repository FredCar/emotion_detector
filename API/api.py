from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)


cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/", methods=["GET"])
@cross_origin()
def home():
    return jsonify(message = "Hello World !!")


if __name__ == "__main__":
    app.run(debug=True)