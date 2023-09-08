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

// toggleDarkMode a été fait par chat gpt

const toggleMode = () => {
  // Get a reference to the body element
  const body = document.body;

  if (body.classList.contains('dark-mode')) {
    // If the body element already has the 'dark-mode' class (indicating it's in dark mode),
    // then switch to light mode by removing the 'dark-mode' class
    body.classList.remove('dark-mode');
    body.classList.add('french-mode');

    // Store the user's preference for light mode in localStorage
    localStorage.setItem('mode', 'french');
  }
  else if (body.classList.contains('french-mode')) {

    body.classList.remove('french-mode');
    body.classList.add('astro-mode');

    localStorage.setItem('mode', 'astro');

  }
  else if (body.classList.contains('astro-mode')) {

    body.classList.remove('astro-mode');
    body.classList.add('sac-mode');

    localStorage.setItem('mode', 'sac');

  }
  else if (body.classList.contains('sac-mode')) {

    body.classList.remove('sac-mode');

    localStorage.setItem('mode', 'light');

  }

  else {

    body.classList.add('dark-mode');

    // Store the user's preference for dark mode in localStorage
    localStorage.setItem('mode', 'dark');
  }
};

// Get a reference to the mode button by its ID
const modeButton = document.getElementById('mode');

// Add a click event listener to the mode button
modeButton.addEventListener('click', toggleMode);

// Check the user's mode preference stored in localStorage
const currentMode = localStorage.getItem('mode');

// If the user has a preference for dark mode ('dark' stored in localStorage), apply it by adding the 'dark-mode' class to the body element
if (currentMode === 'dark') {
  document.body.classList.add('dark-mode');
}
else if (currentMode == "french") {
  document.body.classList.add("french-mode");
}
else if (currentMode == "astro") {
  document.body.classList.add("astro-mode");
}
else if (currentMode == "sac") {
  document.body.classList.add("sac-mode");
}