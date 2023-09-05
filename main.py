from flask import Flask

from flask import render_template, request

from src.utils.ask_question_to_pdf import split_text, ask_question_to_pdf

app = Flask(__name__)

@app.route("/")
def hello(name=None):
    return render_template('index.html', name=name)

@app.route("/prompt", methods = ["POST"])
def prompt() :
    question = request.form["prompt"]
    response = ask_question_to_pdf(question)
    return {"answer": response}
