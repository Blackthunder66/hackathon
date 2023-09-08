from io import StringIO
import os
import fitz
import openai
from dotenv import load_dotenv
from nltk.tokenize import sent_tokenize

load_dotenv()
chemin = "C:/Users/tangu/hackathon/src/utils/fichier_dd.txt"
chemin_b = "C:/Users/Broni/Downloads/PDF"


def open_file(filepath):
    with open(filepath, "r", encoding="utf-8") as infile:
        return infile.read()


openai.api_key = os.getenv("OPENAI_API_KEY")
openai.organization = os.getenv("OPENAI_ORGANIZATION")


def read_pdf(filename):
    context = ""

    # Open the PDF file
    with fitz.open(filename) as pdf_file:
        # Get the number of pages in the PDF file
        num_pages = pdf_file.page_count
        print(num_pages)

        # Loop through each page in the PDF file
        for page_num in range(num_pages):
            # Get the current page
            page = pdf_file[page_num]

            # Get the text from the current page
            page_text = page.get_text().replace("\n", "")

            # Append the text to context
            context += page_text
    return context


def split_text(text, chunk_size=5000):
    """
    Splits the given text into chunks of approximately the specified chunk size.

    Args:
    text (str): The text to split.

    chunk_size (int): The desired size of each chunk (in characters).

    Returns:
    List[str]: A list of chunks, each of approximately the specified chunk size.
    """

    chunks = []
    current_chunk = StringIO()
    current_size = 0
    sentences = sent_tokenize(text)
    for sentence in sentences:
        sentence_size = len(sentence)
        if sentence_size > chunk_size:
            while sentence_size > chunk_size:
                chunk = sentence[:chunk_size]
                chunks.append(chunk)
                sentence = sentence[chunk_size:]
                sentence_size -= chunk_size
                current_chunk = StringIO()
                current_size = 0
        if current_size + sentence_size < chunk_size:
            current_chunk.write(sentence)
            current_size += sentence_size
        else:
            chunks.append(current_chunk.getvalue())
            current_chunk = StringIO()
            current_chunk.write(sentence)
            current_size = sentence_size
    if current_chunk:
        chunks.append(current_chunk.getvalue())
    return chunks


filename = os.path.join(os.path.dirname(__file__), "filename.pdf")
document = read_pdf(filename)
chunks = split_text(document)


def download_file(contenu_fichier):
    # Chemin de destination où vous souhaitez enregistrer le fichier
    chemin_destination = chemin

    # Écrire le contenu dans le fichier de destination
    try:
        with open(chemin_destination, "wb") as fichier_destination:
            fichier_destination.write(contenu_fichier)
        print(f"Fichier enregistré avec succès dans {chemin_destination}")
    except FileNotFoundError:
        print("Le chemin de destination spécifié n'a pas été trouvé.")
    except IsADirectoryError:
        print(
            f"{chemin_destination} est un dossier. Spécifiez un nom de fichier pour la destination."
        )
    except Exception as e:
        print(f"Une erreur s'est produite : {str(e)}")

    return None


def change_doc(doc_2):
    filename_2 = os.path.join(os.path.dirname(__file__), "fichier_dd.txt")
    global document
    document = read_pdf(filename_2)
    return None


def gpt3completion(question, textpdf):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant." + textpdf},
            {"role": "user", "content": question},
        ],
    )
    print(response["choices"][0]["message"]["content"])
    return response["choices"][0]["message"]["content"]


text = "Bilal s'est rasé la barbe"


def ask_question_to_pdf(question, textpdf=text):
    return gpt3completion(question, textpdf)
