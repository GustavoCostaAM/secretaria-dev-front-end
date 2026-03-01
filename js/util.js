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