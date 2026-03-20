from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_wishes', methods=['GET'])
def get_wishes():
    wishes = []
    if os.path.exists('wishes.txt'):
        with open('wishes.txt', 'r', encoding='utf-8') as f:
            wishes = [line.strip() for line in f if line.strip()]
    return jsonify({'wishes': wishes})

@app.route('/add_wish', methods=['POST'])
def add_wish():
    data = request.get_json()
    wish_text = data.get('wish', '').strip()
    if wish_text:
        with open('wishes.txt', 'a', encoding='utf-8') as f:
            f.write(wish_text + '\n')
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Empty wish'}), 400

if __name__ == '__main__':
    print("Starting Happy Birthday Elsa Server! Go to http://127.0.0.1:5000 in your browser.")
    app.run(debug=True, port=5000)
