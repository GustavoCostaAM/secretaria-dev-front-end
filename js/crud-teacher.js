const token = localStorage.getItem('token');

// Carrega o botao de sair
const backButton = document.getElementById("sair")
backButton.addEventListener("click", () => {
    localStorage.removeItem("token") // Remove o token aluno do localStorage
    localStorage.removeItem("id") // Remove o id do localStorage
    window.location.href = "../HTML/login.html"
})

if (!token) {
    window.location.href = 'login.html';
}

//carrega os dados dos alunos
async function loadStudentsData(token) {
    //faz a requisição para o backend
        //filtro basico para pegar os alunos
        const formatedFilter = "STUDENT"

        //envia a req para o backend
        response = await fetch(getListByRoleURL(formatedFilter), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        //le a resposta
        if (response.ok) {
            const data = await response.json()

            //limpa o tbody para evitar duplicação
            tbody.innerHTML = ""

            //preenche o tbody com os dados do aluno
            data.forEach(student => {
                tbody.innerHTML += `<tr class="table-register">
                    <td>${student.registrationNumber}</td>
                    <td id="student-name-${student.id}">${student.name}</td>
                    <td>${student.username}</td>
                    <td>${student.email}</td>
                    <td>
                        <button class="button observation" onclick="openDialog('obs-popup')" data-id="${student.id}">
                            <img src="../assets/icones/fi-br-comment-info.svg">
                        </button>
                    </td>
                </tr>`
            })

            //após preencher a tabela, adiciona os listeners de editar
            openEditNotes()
            showUpdatePopup("success", "Alunos carregados com sucesso.")

            console.log("fluxo terminou")
        } else if (handleSessionExpired(response)) {
            return
        } else {
            showUpdatePopup("error", "Erro ao carregar alunos.")
        }
}

//adiciona event listener para abrir o editar as notas do aluno
async function openEditNotes() {
    //seleciona os botões que foram criados dinamicamente
    const actionButtons = document.querySelectorAll(".button.observation")

    //adiciona os event listeners
    actionButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const studentId = button.getAttribute("data-id")
            
            //devemos pegar as informações por meio de uma req para o back
            //monta o filtro
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
                console.log(data)

                //extrai o nome do aluno e os dados da disciplina
                const studentName = Object.keys(data || {})[0] || document.querySelector("#student-name-"+studentId).innerText
                const disciplinaData = Object.values(data?.[studentName]?.map || data?.[studentName] || {}).find(v => v) || {} //BY IA
                
                if (!disciplinaData) {
                    console.error("Dados inválidos:", data)
                    return
                }
                
                //aqui devemos preencher o popup com as informações do aluno
                //para isso, vamos pegar os elementos do popup
                const name = document.querySelector("#popup-aluno")
                const n1 = document.querySelector("#popup-n1")
                const n2 = document.querySelector("#popup-n2")
                const observacao = document.querySelector("#popup-observacao")
                
                //seta o ID no data-id de editar
                const updateButton = document.querySelector("#edit-grades-button")
                updateButton.setAttribute("data-student-id", studentId)
                
                //adiciona os ids dos assessments
                if(disciplinaData.assessmentId1){
                    n1.setAttribute("data-assessment-id", disciplinaData.assessmentId1)
                }
                else{
                    n1.removeAttribute("data-assessment-id")
                }
                
                if(disciplinaData.assessmentId2){
                    n2.setAttribute("data-assessment-id", disciplinaData.assessmentId2)
                }
                else{
                    n2.removeAttribute("data-assessment-id")
                }
                
                //adiciona event listener do botão de atualizar
                addUpdateButton()
                
                //preenche os campos do popup
                name.innerText = `Boletim de ${studentName}`
                n1.value = disciplinaData.nota1 !== null ? disciplinaData.nota1 : undefined
                n2.value = disciplinaData.nota2 !== null ? disciplinaData.nota2 : undefined
                observacao.value = disciplinaData.observations || ''
                console.log(disciplinaData)
            } else if (handleSessionExpired(response)) {
                return
            }
        })
    })
}

//funcao de criar assessments com o back
async function createDefaultAssessments(studentId) {
    const [response1, response2] = await Promise.all([
        createAssessment(studentId),
        createAssessment(studentId)
    ])

    if (!response1.ok) {
        if (handleSessionExpired(response1)) {
            return false
        }
        return false
    }

    if (!response2.ok) {
        if (handleSessionExpired(response2)) {
            return false
        }
        return false
    }

    return true
}

async function createAssessment(studentId, inputGrade) {
    console.log("criando novo assessment")
    const body = {
        grade: inputGrade,
        studentId: studentId,
        observations: "",
    }

    //aqui devemos criar um assessment vazio para o aluno,
    const createResponse = await fetch(getSendGradesURL(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    return createResponse
}

async function updateAssessment(assessmentId, grade, observations, studentId) {
    const data = {
        assessmentId: assessmentId,
        grade: grade,
        studentId: studentId,
        observations: observations
    }

    const response = await fetch(getUpdateGradesURL(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    console.log(response)

    if (response.ok){
        //caso de sucesso
        console.log("Assessment atualizado com sucesso.")

    }else if (handleSessionExpired(response)) {
        return
    }
}

async function addUpdateButton(){
    const updateButton = document.querySelector("#edit-grades-button")
    updateButton.addEventListener("click", async function () {
        //pegamos os ids das notas 1 e 2, e aluno
        const studentId = updateButton.getAttribute("data-student-id")
        let assessmentId1 = document.querySelector("#popup-n1").getAttribute("data-assessment-id")
        let assessmentId2 = document.querySelector("#popup-n2").getAttribute("data-assessment-id")

        //pegamos os valores das notas e observação
        const grade1 = document.querySelector("#popup-n1").value
        const grade2 = document.querySelector("#popup-n2").value
        const observations = document.querySelector("#popup-observacao").value

        if(!assessmentId1){
            const response = await Promise.resolve(createAssessment(studentId, grade1))
            if(!response.ok){
                console.error("Erro ao criar uma assessment para n1")
            }
            console.log(response)
        }
        console.log(assessmentId1)

        if(!assessmentId2){
            const response = await Promise.resolve(createAssessment(studentId, grade2))
            if(!response.ok){
                console.error("Erro ao criar uma assessment para n2")
            }
            console.log(response.json)
        }
        console.log(assessmentId2)
        

        //atualizamos os dois assessments
        await updateAssessment(assessmentId1, grade1, observations, studentId)
        await updateAssessment(assessmentId2, grade2, observations, studentId)

        console.log("Notas atualizadas com sucesso.")
        showUpdatePopup("success", "Notas atualizadas com sucesso.")
    }, {once: true})
}

//carrega os dados dos alunos ao abrir a página
loadStudentsData(token)

//Alterar 
document.getElementById("teachers-subject").innerHTML = localStorage.getItem("subject")