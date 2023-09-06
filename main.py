from flask import Flask

from flask import render_template, request

from src.utils.ask_question_to_pdf import split_text, ask_question_to_pdf, read_pdf, document, chunks, text

app = Flask(__name__)

@app.route("/")
def hello(name=None):
    return render_template('index.html', name=name)

@app.route("/question", methods = ["GET"])
def ask_question() :
    question = ask_question_to_pdf(question = "pose moi une question sur le texte", textpdf = document)
    return {"answer" : question}

@app.route("/prompt", methods = ["POST"])
def prompt() :
    question = request.form["prompt"]
    response = ask_question_to_pdf(question)
    return {"answer": response}

@app.route("/answer", methods = ["POST"])
def answer() :
    answer = request.form["prompt"]
    response = ask_question_to_pdf(answer + "est-ce vrai ou faux?", textpdf = document)
    return {"answer": response}