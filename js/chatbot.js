//id do usuario

//carrega o botão para abrir o chatbot
const chatbotButton = document.querySelector("#open-chatbot");

//carrega o container do chatbot
const chatbotContainer = document.querySelector("#blocoMensagens");

//listener para abrir o conteiner de mensagens
chatbotButton.addEventListener("click", () => {
    if (chatbotContainer.style.display === "none") {
        chatbotContainer.style.display = "flex";
    } else {
        chatbotContainer.style.display = "none";
    }
});

//listener para enviar a mensagem
const chatForm = document.querySelector(".chatInputArea");

if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const messageInput = document.querySelector("#chatMessageInput");
        if (!messageInput) {
            return;
        }

        const message = messageInput.value.trim();
        const storedUserId = localStorage.getItem("id");
        const userId = Number.parseInt(storedUserId);

        if (message !== "") {
            addMessage(message, "userMessage");
            messageInput.value = "";

            if (Number.isNaN(userId)) {
                console.error("ID de usuario invalido no localStorage.");
                return;
            }

            // envia requisição para o chatbot
            fetch(getLocalChatbotURL(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    message: message
                })
            }).then(response => {
                if (response.ok) {
                    //pega a resposta do JSON e ja adiciona a mensagem do chatbot
                    response.json().then(data => {
                        const botMessage = data.response;
                        addMessage(botMessage, "botMessage");
                    })
                }else{
                    addMessage("Erro ao se comunicar com o chatbot. Tente novamente mais tarde.", "botMessage");

                    console.error("Erro na resposta do chatbot:", response.json().then(data => {
                        console.error(data.error);
                    }));
                }
            })
        }
    });
}

// Função para adicionar mensagens ao container
function addMessage(message, sender) {
    const messagesContainer = document.querySelector("#blocoMensagens");
    const inputArea = document.querySelector(".chatInputArea");
    if (!messagesContainer || !inputArea) {
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);

    const messageText = document.createElement("p");
    if (sender === "botMessage") {
        messageText.innerHTML = message;
    } else {
        messageText.textContent = message;
    }
    messageElement.appendChild(messageText);

    messagesContainer.insertBefore(messageElement, inputArea);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}