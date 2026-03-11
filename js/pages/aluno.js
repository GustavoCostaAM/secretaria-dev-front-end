//carrega os elementos do html para listagem
const table = document.querySelector("#table")
const tbody = table.querySelector("tbody")

// Carrega o botao de sair
const backButton = document.getElementById("sair")
backButton.addEventListener("click", () => {
    localStorage.removeItem("token") // Remove o token aluno do localStorage
    window.location.href = "login.html"
})

//pega o token do localStorage
const token = localStorage.getItem("token")

//se o token não existir, redireciona para a página de login
// if (!token) {
//     window.location.href = "login.html"
// }

loadStudentData(token, "") //load de notas padrão (sem filtro)

//adiciona event listener para o campo de filtro
const filterInput = document.querySelector("#search")
const searchForm = document.querySelector("#search-div form")

searchForm.addEventListener("submit", function (event) {
    event.preventDefault() //impede que o formulario reinicie a pagina
})

filterInput.addEventListener("change", function (event) {
    const filterValue = event.target.value
    loadStudentData(token, filterValue) //load de notas com filtro
})


//listagem das informações do aluno
async function loadStudentData(token, filter) {
    if (filter == "") {
        header = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }

        const response = await fetch(getStudentDataURL(), {
            method: "GET",
            headers: header,
        })

        if (response.ok) {
            const data = await response.json()

            tbody.innerHTML = ""

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
    } else {
        const formatedFilter = "filtro=subject=" + filter.toLowerCase()

        header = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded"
        }

        const response = await fetch(getStudentDataURL() + "?" + formatedFilter, {
            method: "GET",
            headers: header,
        })

        if (response.ok) {
            const data = await response.json()

            tbody.innerHTML = ""

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
        } else if (handleSessionExpired(response)) {
            return
        }
    }
}
