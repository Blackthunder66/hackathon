import os

from flask import Flask

from flask import render_template, request


from src.utils.ask_question_to_pdf import (
    ask_question_to_pdf,
    document,
    change_doc,
    chemin,
)


UPLOAD_FOLDER = chemin
ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def hello(name=None):
    return render_template("index.html", name=name)


@app.route("/drop", methods=["PUT"])
def file():
    # app.logger.info("AAAAAAAA")
    contenu_fichier = request.files["drop"]
    contenu_fichier.save(
        os.path.join(app.config["UPLOAD_FOLDER"], contenu_fichier.filename)
    )
    # download_file(contenu_fichier)
    change_doc(contenu_fichier, name=contenu_fichier.filename)
    return None


@app.route("/question", methods=["GET"])
def ask_question():
    question = ask_question_to_pdf(
        question="pose moi une question sur le texte", textpdf=document
    )
    return {"answer": question}


@app.route("/prompt", methods=["POST"])
def prompt():
    question = request.form["prompt"]
    response = ask_question_to_pdf(question)
    return {"answer": response}


@app.route("/answer", methods=["POST"])
def answer():
    answer = request.form["prompt"]
    response = ask_question_to_pdf(answer + "est-ce vrai ou faux?", textpdf=document)
    return {"answer": response}
