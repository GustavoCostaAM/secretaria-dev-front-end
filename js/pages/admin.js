//carrega o token do usuario
const token = localStorage.getItem("token")

// Carrega o botao de sair
const backButton = document.getElementById("sair")
backButton.addEventListener("click", () => {
    localStorage.removeItem("token") // Remove o token aluno do localStorage
    window.location.href = "login.html"
})

//pega os elementos da pagina de adm
const table = document.querySelector("#table-infos")

//carrega os alunos conectados
async function getUsersData() {
    response = await fetch(getUsersURL(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.ok) {
        const data = await response.json()
        console.log(data)

        table.innerHTML = ""

        Object.values(data).forEach(element => {
            table.innerHTML += `<tr class="table-register">
                    <td>${element.id}</td>
                    <td>${element.username}</td>
                    <td>${element.email}</td>
                    <td>${element.role}</td>
                    <td>
                        <button class="edit register" data-id="${element.id}">
                            ✏️
                        </button>
                        <button class="delete register" data-id="${element.id}">
                            🗑️
                        </button>
                    </td>
                </tr>`
        });

        loadDeleteButtons()

        console.log("fluxo terminou")
    } else if (handleSessionExpired(response)) {
        return
    }
}

async function loadDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete.register")

    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const userId = button.getAttribute("data-id")
            const response = await fetch(getDeleteUserURL(userId), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })

            if (response.ok) {
                getUsersData()

                console.log("Usuario deletado com sucesso")
            } else if (handleSessionExpired(response)) {
                return
            }
        })
    })
}

getUsersData()
