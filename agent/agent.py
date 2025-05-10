from flask import Flask, request, jsonify
from flask_cors import CORS  # For handling Cross-Origin Requests (important for local development)
import google.generativeai as genai
import logging

# Replace with your actual API key
genai.configure(api_key='AIzaSyB3dZ1tpzyBmkffGjFWTCa99yXdk4CSa8k')
model = genai.GenerativeModel('gemini-2.0-flash')

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

match_data = [
    {
        "match_id": "1",
        "team_a": {
            "name": "Team Alpha",
            "wins": 7,
            "rank": 3,
            "recent_win_rate": 0.75,
            "players": [
                {"name": "Player A1", "win_rate_last_10": 0.80, "role": "Carry"},
                {"name": "Player A2", "win_rate_last_10": 0.70, "role": "Mid"},
            ],
        },
        "team_b": {
            "name": "Team Beta",
            "wins": 3,
            "rank": 8,
            "recent_win_rate": 0.40,
            "players": [
                {"name": "Player B1", "win_rate_last_10": 0.50, "role": "Carry"},
                {"name": "Player B2", "win_rate_last_10": 0.60, "role": "Support"},
            ],
        },
        "map": "Map 1",
        "start_time": "2025-05-15T18:00:00Z",
    },
    {
        "match_id": "2",
        "team_a": {
            "name": "Team Gamma",
            "wins": 5,
            "rank": 5,
            "recent_win_rate": 0.60,
            "players": [
                {"name": "Player G1", "win_rate_last_10": 0.75, "role": "Jungle"},
                {"name": "Player G2", "win_rate_last_10": 0.65, "role": "Top"},
            ],
        },
        "team_b": {
            "name": "Team Delta",
            "wins": 6,
            "rank": 4,
            "recent_win_rate": 0.65,
            "players": [
                {"name": "Player D1", "win_rate_last_10": 0.70, "role": "Mid"},
                {"name": "Player D2", "win_rate_last_10": 0.55, "role": "Support"},
            ],
        },
        "map": "Map 2",
        "start_time": "2025-05-16T20:30:00Z",
    },
    {
        "match_id": "3",
        "team_a": {
            "name": "Team Epsilon",
            "wins": 4,
            "rank": 7,
            "recent_win_rate": 0.50,
            "players": [
                {"name": "Player E1", "win_rate_last_10": 0.60, "role": "Carry"},
                {"name": "Player E2", "win_rate_last_10": 0.55, "role": "Support"},
            ],
        },
        "team_b": {
            "name": "Team Zeta",
            "wins": 4,
            "rank": 6,
            "recent_win_rate": 0.55,
            "players": [
                {"name": "Player Z1", "win_rate_last_10": 0.65, "role": "Mid"},
                {"name": "Player Z2", "win_rate_last_10": 0.60, "role": "Jungle"},
            ],
        },
        "map": "Map 3",
        "start_time": "2025-05-17T16:45:00Z",
    },
]

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    app.logger.info(f"Received user message: {user_message}")
    if not user_message:
        app.logger.warning("No message provided")
        return jsonify({'error': 'No message provided'}), 400

    prompt = f"""You are a helpful AI beting consultant whose  knowledge comes from the following match data:
    {match_data}
    You must strictly base your answers and suggestions on this data and nothing else.
    The user has asked: "{user_message}"
    Respond to the user's query in the following way : check the data and with your own criterias
    find the best answer
    to the users quesry , try to keep the answers relatively short and to the point , do not 
    give data details execpt if the user asked for. Be verbose and the most human like possible.
    avoid giving long data explanations and go for more natural answers.
    Please also act as a front desk for our app so do not only focus on the pure data if the player greets
    or thanks , answer naturally.
    Of course you can also answer questions regarding the project wich is a betting website powered by ai
    sugestions.
    Do not hesitate to propose your help.
    Please kit the naswers short. Only if providing data please present it in a clean way with lists and
    spacing.
    """
    app.logger.info(f"Generated prompt: {prompt}")

    try:
        response = model.generate_content(prompt)
        app.logger.info(f"Gemini API response: {response}")
        ai_response = response.text
        app.logger.info(f"AI response text: {ai_response}")
        return jsonify({'response': ai_response})
    except Exception as e:
        app.logger.error(f"Error during Gemini API interaction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)