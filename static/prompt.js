const promptForm = document.getElementById("prompt-form");
const submitButton = document.getElementById("submit-button");
const questionButton = document.getElementById("question-button");
const messagesContainer = document.getElementById("messages-container");


const appendHumanMessage = (message) => {
  const humanMessageElement = document.createElement("div");
  humanMessageElement.classList.add("message", "message-human");
  humanMessageElement.innerHTML = message;
  messagesContainer.appendChild(humanMessageElement);
};

const appendAIMessage = async (messagePromise) => {
  // Add a loader to the interface
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("message");
  loaderElement.innerHTML =
    "<div class='loader'><div></div><div></div><div></div>";
  messagesContainer.appendChild(loaderElement);

  // Await the answer from the server
  const messageToAppend = await messagePromise();

  // Replace the loader with the answer
  loaderElement.classList.remove("loader");
  loaderElement.innerHTML = messageToAppend;
};

const handlePrompt = async (event) => {
  event.preventDefault();
  // Parse form data in a structured object
  const data = new FormData(event.target);
  promptForm.reset();

  let url = "/prompt";
  if (questionButton.dataset.question !== undefined) {
    url = "/answer";
    data.append("question", questionButton.dataset.question);
    delete questionButton.dataset.question;
    questionButton.classList.remove("hidden");
    submitButton.innerHTML = "Message";
  }

  appendHumanMessage(data.get("prompt"));

  await appendAIMessage(async () => {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result.answer;
  });
};

promptForm.addEventListener("submit", handlePrompt);

const handleQuestionClick = async (event) => {
  appendAIMessage(async () => {
    const response = await fetch("/question", {
      method: "GET",
    });
    const result = await response.json();
    const question = result.answer;

    questionButton.dataset.question = question;
    questionButton.classList.add("hidden");
    submitButton.innerHTML = "Répondre à la question";
    return question;
  });
};

questionButton.addEventListener("click", handleQuestionClick);



/* Bouton drag and drop */
const fileNameDisplay = document.getElementById('file-name');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');


const handlefile = async (event, file) => {
  event.preventDefault();
  // Parse form data in a structured object
  const data = new FormData();
  data.append("drop", file);
  let url = "/drop";

  const response = await fetch(url, {
    method: "PUT",
    body: data,
  });
  console.log(reponse)
};


dropZone.addEventListener('click', () => {
  fileInput.click();
});


fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    // Vous pouvez ajouter ici la logique pour traiter le fichier
    fileNameDisplay.textContent = `Fichier sélectionné : ${file.name}`;
    // Ajoutez ici la logique pour télécharger le fichier
    // appeler la fonction handle file
    handlefile(e, file);
  }

});



dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#333';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '#ccc';
});


dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#ccc';
  const file = e.dataTransfer.files[0];
  if (file) {

    // Vous pouvez ajouter ici la logique pour traiter le fichier
    fileNameDisplay.textContent = `Fichier glissé et déposé : ${file.name}`;

    // appeler la fonction handle file
    handlefile(e, file);
  }

});



