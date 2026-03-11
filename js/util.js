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

function handleSessionExpired(response) {
    if (response.status === 403 || response.status === 401) {
        window.alert("Sessão expirada, faça login novamente.")
        localStorage.removeItem("token")
        window.location.href = "login.html"
        return true
    }

    return false
}
