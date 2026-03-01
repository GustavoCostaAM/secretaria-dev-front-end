//carrega os elementos do html para listagem
const table = document.querySelector("#table")
const tbody = table.querySelector("tbody")

//pega o token do localStorage
const token = localStorage.getItem("token")

//se o token não existir, redireciona para a página de login
if (!token) {
    window.location.href = "login.html"
}

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
    //faz requisição para API do backend
    if (filter == "") {
        //caso sem filtro (busca todos)
        header = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
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
        } else {
            //caso de erro, apaga o token e manda para tela de login
            window.alert("Sessão expirada, faça login novamente.")
            localStorage.removeItem("token")
            window.location.href = "login.html"
        }
    } else {
        //fazendo casos com filtro (padrao é a busca por máteria)
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
            //caso de sucesso
            const data = await response.json()

            //limpa o tbody para evitar duplicação
            tbody.innerHTML = ""

            //preenche o tbody com os dados do aluno
            console.log(data)

            Object.values(data).forEach(element => {
                tbody.innerHTML += `<tr>
                    <td>${element.disciplina}</td>
                    <td>${element.nota1}</td>
                    <td>${element.nota2}</td>
                    <td>${element.media}</td>
                    <td>${element.aprovado ? 'Aprovado' : 'Reprovado'}</td>
                </tr>`
            });
        } else if (response.status === 403 || response.status === 401) {
            //caso de erro, apaga o token e manda para tela de login
            window.alert("Sessão expirada, faça login novamente.")
            localStorage.removeItem("token")
            window.location.href = "login.html"
        }
    }
}