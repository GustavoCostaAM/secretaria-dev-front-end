//carrega o token do usuario
const token = localStorage.getItem("token")
const adminTableBody = document.querySelector("#table-infos")

// Carrega o botao de sair
const backButton = document.getElementById("sair")
backButton.addEventListener("click", () => {
    localStorage.removeItem("token") // Remove o token aluno do localStorage
    localStorage.removeItem("id") // Remove o id do localStorage
    window.location.href = "../HTML/login.html"
})

if (!token) {
    window.location.href = "login.html"
}

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

        if (!adminTableBody) {
            console.error("Elemento #table-infos nao encontrado no HTML")
            return
        }

        //limpa a tabela
        adminTableBody.innerHTML = ""

        //preenche a tabela
        Object.values(data).forEach(element => {
            adminTableBody.innerHTML += `<tr class="table-register">
                    <td>${element.id}</td>
                    <td>${element.name}</td>
                    <td>${element.email}</td>
                    <td>${element.username}</td>
                    <td>
                        ${
                            element.role === "STUDENT"
                            ? "Aluno"
                            : element.role === "TEACHER"
                            ? "Professor"
                            : "Administrador"
                        }
                    </td>
                    <td>
                        <button class="edit register" data-id="${element.id}" onclick="openDialog('edit-register')">
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
        loadEditButtons()

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

async function loadEditButtons() {

    const editButtons = document.querySelectorAll(".edit.register")

    editButtons.forEach(button => {
        button.addEventListener("click", async () => {

            const userId = button.getAttribute("data-id")

            const response = await fetch(getUserByIdURL(userId), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })

            //adiona event listener de edição
            loadEditFormSubmit()

            if (response.ok) {
                const user = await response.json()
            
                document.getElementById("edit-user-id").value = user.id
                document.getElementById("name").value = user.name || ""
                document.getElementById("email").value = user.email || ""
                document.getElementById("username").value = user.username || ""          
                document.getElementById("edit-register").showModal()

            } else if (handleSessionExpired(response)) {
                return
            }
        })
    })
}

function loadEditFormSubmit() {

    const form = document.getElementById("editUserForm")

    form.addEventListener("submit", async function (event) {
        event.preventDefault()

        const userId = document.getElementById("edit-user-id").value
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const username = document.getElementById("username").value

        const response = await fetch(getUpdateUserURL(userId), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                username
            })
        })

        if (response.ok) {
            getUsersData()
            document.getElementById("edit-register").close()
            console.log("Usuário atualizado com sucesso")
        } else if (handleSessionExpired(response)) {
            return
        }
    })
}

//carrega os dados dos usuarios assim que a pagina é aberta
getUsersData()


//carrega as materias para o dropList de criação de professores
const subjectDropList = document.getElementById("subjectDropList")

async function loadSubjects() {
    if (!subjectDropList) {
        console.error("Elemento subjectDropList nao encontrado no HTML")
        return
    }

    response = await fetch(getSubjectsURL(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.ok) {
        const subjects = await response.json()
     
        //adiciona elementos ao droplist
        subjects.forEach(subject => {
            const option = document.createElement("option")
            option.value = subject.id
            option.textContent = subject.name
            subjectDropList.appendChild(option)
        })
    }

    console.log(response)
}

loadSubjects()