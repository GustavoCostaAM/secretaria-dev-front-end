// Carrega o botao de sair
const backButton = document.getElementById("sair")
backButton.addEventListener("click", () => {
    localStorage.removeItem("token") // Remove o token aluno do localStorage
    localStorage.removeItem("id") // Remove o id do localStorage
    window.location.href = "../HTML/login.html"
})

//pega o token do localStorage
const token = localStorage.getItem("token")

//se o token não existir, redireciona para a página de login
if (!token) {
    window.location.href = "login.html"
}

loadStudentData(token) //load de notas padrão

//listagem das informações do aluno
async function loadStudentData(token) {
    //faz requisição para API do backend

    //caso sem filtro (busca todos)
        const header = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }

        // Define a variável tbody
        const tbody = document.getElementById("tbody")
        if (!tbody) {
            console.error("Elemento tbody não encontrado!")
            return
        }

        const response = await fetch(getStudentDataURL(), {
            method: "GET",
            headers: header,
        })

        if (response.ok) {
            //caso de sucesso
            const data = await response.json()

            //limpa o tbody para evitar duplicação
            tbody.innerHTML = ""

            //preenche o tbody com os dados do aluno
            console.log(data)

            Object.values(data).forEach(element => {
                tbody.innerHTML += `<tr class="table-register">
                    <td>${element.disciplina}</td>
                    <td>${element.nota1}</td>
                    <td>${element.nota2}</td>
                    <td>${element.media}</td>
                    <td>${element.aprovado ? 'Aprovado' : 'Reprovado'}</td>
                </tr>`
            });

            console.log("fluxo terminou")
        } else if (handleSessionExpired(response)) {
            return
        }
    }