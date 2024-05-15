from flask import Flask, request, jsonify, make_response
from textblob import TextBlob

app = Flask(__name__)


@app.route('/')
def home():
    return "Welcome to the Mood Analysis API!"


@app.route('/analyze_mood', methods=['POST'])
def analyze_mood():
    data = request.get_json()
    text = data['text']
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        mood = "Positive"
        suggested_activity = "Enjoy a walk or listen to some uplifting music!"
    elif polarity < -0.1:
        mood = "Negative"
        suggested_activity = "Maybe some meditation or reading could help."
    else:
        mood = "Neutral"
        suggested_activity = "You seem balanced today, keep it up!"

    response = make_response(jsonify({
        'mood': mood,
        'suggestedActivity': suggested_activity
    }))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


if __name__ == '__main__':
    app.run(debug=True)
