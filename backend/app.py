from flask import Flask, request, jsonify
from textblob import TextBlob

app = Flask(__name__)


@app.route('/')
def home():
    return "Welcome to the Mood Analysis API!"

# @app.route('/analyze_mood', methods=['POST'])
# def analyze_mood():
#     text = request.json.get('text')
#     blob = TextBlob(text)
#     response = {
#         'polarity': blob.sentiment.polarity,
#         'subjectivity': blob.sentiment.subjectivity
#     }
#     return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
