const prodPath = "https://secretaria-dev-backend.onrender.com/"
const localPath = "http://localhost:8080/"

let usePath = prodPath

usePath = localPath //descomente essa linha para usar o backend local


function getSingUpURL(){
    return usePath + "api/users/registerStudent"
}

function getSingUpRedirectURL(){
    return window.location.href.replace("signup.html", "signin.html")
}

function getStudentDataURL(){
    return usePath + "api/grades/boletim"
}

function getLoginURL(){
    return usePath + "api/auth/login"
}

function getUsersURL(){
    return usePath + "api/users/listActive"
}

function getDeleteUserURL(userId){
    return usePath + `api/users/${userId}`
}

function getListByRoleURL(role){
    return usePath + `api/users/listByRole?role=${role}`
}

function getUpdateUserURL(userId){
    return usePath + `api/users/${userId}`
}

function getSendGradesURL(){
    return usePath + "api/grades/sendGrades"
}

function getUserByIdURL(userId){
    return usePath + `api/users/${userId}`
}
function getUpdateGradesURL() {
    return usePath + "api/grades/updateGrades"
}

function getRecoveryMailURL() {
    return usePath + "api/redefine/sendRecoveryMail"
}

function getValidateRecoveryCodeURL(code) {
    return usePath + "api/redefine/recover/" + code
}

function getUpdatePasswordURL() {
    return usePath + "api/redefine/resetPassword"
}

function getSubjectsURL() {
    return usePath + "api/subjects/list"
}

function getLocalChatbotURL() {
    return "http://localhost:8090/chat"
}

function handleSessionExpired(response) {
    if (response.status === 403 || response.status === 401) {
        window.alert("Sessão expirada, faça login novamente.")
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        window.location.href = "login.html"
        return true
    }

    return false
}


const table = document.querySelector("#table")
    
    if (table) {
        const tbody = table.querySelector("tbody")
        
        if (tbody) {
            // Configura o filtro apenas se os elementos existirem
            const filterInput = document.querySelector("#search")
            const searchForm = document.querySelector("#search-div form")
            
            if (searchForm) {
                searchForm.addEventListener("submit", function (event) {
                    event.preventDefault() //impede que o formulario reinicie a pagina
                })
            }
            
            if (filterInput) {
                filterInput.addEventListener("input", function (event) {
                    const filterValue = event.target.value.toLowerCase().trim()
                    filterTable(filterValue, tbody)
                })
            }
        }
    }

function detectProfessorPage() {
    if (window.location.href.includes("professor") || 
        window.location.href.includes("crud-professor")) {
        return true
    } return false
}
function filterTable(filterText, tbody) {
    const rows = tbody.querySelectorAll("tr")
    const isProfessorPage = detectProfessorPage() 

    rows.forEach(row => {
            if(isProfessorPage){
                const subjectTd = row.querySelector("td:first-child")        
                const subjectName = subjectTd.textContent.toLowerCase()

                const nomeTd =  row.querySelector("td:nth-child(2)")
                const nomeName =   nomeTd.textContent.toLowerCase()

                const  apelidoTd =  row.querySelector("td:nth-child(3)")
                const apelidoName =   apelidoTd.textContent.toLowerCase()

                const  emailTd =  row.querySelector("td:nth-child(4)")
                const emailName =   emailTd.textContent.toLowerCase()

                if (filterText === "" || subjectName.includes(filterText) || nomeName.includes(filterText) || apelidoName.includes(filterText) || emailName.includes(filterText)) {
                    row.classList.remove("hidden") // Mostra a linha
                } else {
                    row.classList.add("hidden") // Esconde a linha
                }
            } else{
                const matriculaTd = row.querySelector("td:first-child")        
                const matriculaName = matriculaTd.textContent.toLowerCase()
                if (filterText === "" || matriculaName.includes(filterText)) {
                    row.classList.remove("hidden") // Mostra a linha
                } else {
                    row.classList.add("hidden") // Esconde a linha
                }
            }

        }
    )
}