//carrega o elemento html para inserir os blocos de observações
const obsContainer = document.querySelector(".cards-container")

//pega o token do localStorage
const token = localStorage.getItem("token")

if (!token) {
    window.location.href = "login.html"
}

obsContainer.innerHTML = "" //limpa o container para evitar duplicação
loadObservations() //carrega as observações do aluno


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
            <p class="card-description">${element.observacao}</p>
        </div>`
        })
    } else if (handleSessionExpired(response)) {
        return
    }
}