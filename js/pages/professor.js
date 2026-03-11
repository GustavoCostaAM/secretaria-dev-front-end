const token = localStorage.getItem('token');

// Carrega o botao de sair
const backButton = document.getElementById("sair")
backButton.addEventListener("click", () => {
    localStorage.removeItem("token") // Remove o token aluno do localStorage
    window.location.href = "login.html"
})

if (!token) {
    window.location.href = 'login.html';
}

//pega os elementos da tabela e do filtro
const tbody = document.querySelector("#tbody")
const filterInput = document.querySelector("#search")

//carrega os dados dos alunos
async function loadStudentsData(token, filter) {
    if (!filter) {
        const formatedFilter = "STUDENT"

        response = await fetch(getListByRoleURL(formatedFilter), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        if (response.ok) {
            const data = await response.json()

            tbody.innerHTML = ""

            data.forEach(student => {
                tbody.innerHTML += `<tr class="table-register">
                    <td>${student.registrationNumber}</td>
                    <td>${student.name}</td>
                    <td>${student.username}</td>
                    <td>${student.email}</td>
                    <td>
                        <button class="button observation" onclick="openDialog('obs-popup')" data-id="${student.id}">
                            <img src="assets/icons/fi-br-comment-info.svg" alt="Observação">
                        </button>
                    </td>
                </tr>`
            })

            openEditNotes()

            console.log("fluxo terminou")
        } else if (handleSessionExpired(response)) {
            return
        }
    }
}

async function openEditNotes() {
    const actionButtons = document.querySelectorAll(".button.observation")
    
    actionButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const studentId = button.getAttribute("data-id")

            const subject = localStorage.getItem("subject")
            var filter = "?filtro=subject=" + subject + ",studentId=" + studentId

            const response = await fetch(getStudentDataURL() + filter, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })

            if (response.ok) {
                var data = await response.json()

                const hasNoAssessment = !data || (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0)
                if(hasNoAssessment){
                    console.log("criando novo assessment")
                    const body = {
                        grade: 0,
                        studentId: studentId,
                        observations: "",
                    }

                    const createResponse = await fetch(getSendGradesURL(), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(body)
                    })

                    if(createResponse.ok){
                        const secondResponse = await fetch(getStudentDataURL() + filter, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                        })

                        if(secondResponse.ok){
                            data = await secondResponse.json()
                        } else if (handleSessionExpired(secondResponse)) {
                            return
                        }
                    } else if (handleSessionExpired(createResponse)) {
                        return
                    }

                }

                const studentName = Object.keys(data || {})[0] || ''
                const disciplinaData = Object.values(data?.[studentName]?.map || data?.[studentName] || {}).find(v => v) || {}

                if (!disciplinaData) {
                    console.error("Dados inválidos:", data)
                    return
                }

                const name = document.querySelector("#popup-aluno")
                const n1 = document.querySelector("#popup-n1")
                const n2 = document.querySelector("#popup-n2")
                const observacao = document.querySelector("#popup-observacao")

                name.innerText = `Boletim de ${studentName}`
                n1.value = disciplinaData.nota1 !== null ? disciplinaData.nota1 : ''
                n2.value = disciplinaData.nota2 !== null ? disciplinaData.nota2 : ''
                observacao.value = disciplinaData.observations || ''
            } else if (handleSessionExpired(response)) {
                return
            }
        })

    })
}

loadStudentsData(token)
