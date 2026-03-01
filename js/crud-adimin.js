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
    if (response.ok){
        const data = await response.json()
        console.log(data)

        //limpa a tabela
        table.innerHTML = ""

        //preenche a tabela
        Object.values(data).forEach(element => {
                table.innerHTML += `<tr>
                    <td>${element.id}</td>
                    <td>${element.username}</td>
                    <td>${element.email}</td>
                    <td>${element.role}</td>
                    <td>
                        <button class="edit register">
                            ✏️
                        </button>
                        <button class="delete register">
                            🗑️
                        </button>
                    </td>
                </tr>`
            });

            console.log("fluxo terminou")
    }




}

getUsersData()