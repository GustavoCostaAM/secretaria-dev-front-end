//carrega o elemento html para inserir os blocos de observações
const obsContainer = document.querySelector(".cards-container")

// Carrega o botao de voltar
const backButton = document.getElementById("back-to-home")
backButton.addEventListener("click", () => {
    window.location.href = "../HTML/crud-base.html"
})

//pega o token do localStorage
const token = localStorage.getItem("token")

if (!token) {
    window.location.href = "login.html"
}

//método para carregar as observações do aluno
async function loadObservations() {
    const header = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    const response = await fetch(getStudentDataURL(), {
        method: "GET",
        headers: header,
    })

    if (response.ok) {
        const data = await response.json()

        Object.values(data).forEach(element => {
            obsContainer.innerHTML += `<div class="card">
            <h2 class="card-title">${element.disciplina}</h2>
            <p class="card-description">${element.observations}</p>
        </div>`
        })

        console.log(data)
    } else if (handleSessionExpired(response)) {
        return
    }
}

obsContainer.innerHTML = "" //limpa o container para evitar duplicação
loadObservations() //carrega as observações do aluno
