//carrega o token do usuario
const token = localStorage.getItem("token")

if (!token) {
    window.location.href = "login.html"
}

//pega os elementos da pagina de adm
const table = document.querySelector("#table-infos")

//carrega os alunos conectados
async function getUsersData() {
    //envia a req para o back
    response = await fetch(getUsersURL(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    //le a resposta
    if (response.ok) {
        const data = await response.json()
        console.log(data)

        //limpa a tabela
        table.innerHTML = ""

        //preenche a tabela
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

        //após preencher a tabela, adiciona os listeners de deletar
        loadDeleteButtons()

        console.log("fluxo terminou")
    } else if (handleSessionExpired(response)) {
        return
    }
}

//adiciona event listener para deletar usuarios (desativar)
async function loadDeleteButtons() {
    //pega os botoes
    const deleteButtons = document.querySelectorAll(".delete.register")

    //adiciona o event listener para cada botao
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
                //recarrega os dados dos usuarios
                getUsersData()

                console.log("Usuario deletado com sucesso")
            } else if (handleSessionExpired(response)) {
                return
            }
        })
    })
}

//carrega os dados dos usuarios assim que a pagina é aberta
getUsersData()
