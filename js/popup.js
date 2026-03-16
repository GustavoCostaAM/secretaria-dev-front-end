function openDialog(id){
    let dialog = document.getElementById(id)

    //Caso for o popup de observações, limpar os inputs.
    if(id === "obs-popup"){
        const n1 = document.getElementById("popup-n1")
        const n2 = document.getElementById("popup-n2")
        const observacao = document.getElementById("popup-observacao")
        const aluno = document.getElementById("popup-aluno")

        if (n1) n1.value = ""
        if (n2) n2.value = ""
        if (observacao) observacao.value = ""
        if (aluno) aluno.textContent = "Boletim de ..."
    }

    if (dialog) {
        dialog.showModal()
    }
}

function closeDialog(id){
    let dialog = document.getElementById(id)
    dialog.close()
}

function showUpdatePopup(type, message){
    console.log("Function called")
    let popup = document.getElementById("update-popup");
    let icon = document.getElementById("popup-icon");
    let progressbar = document.getElementById("progress-bar")
    let messageDiv = document.getElementById("popup-message")
    let chatbotOpenButton = document.getElementById("open-chatbot") //logica feita apenas para a tela de estudante

    popup.hidden = false
    progressbar.style.width = "0%"
    
    if(type==="success"){
        icon.src = "../assets/icons/fi-br-check.svg"
        progressbar.style.backgroundColor = "var(--darker-green)"
    }
    else{
        icon.src = "../assets/icons/fi-br-cross-red.svg"
        progressbar.style.backgroundColor = "var(--red)"
    }

    messageDiv.textContent = message

    let width = 1
    let intervalId = setInterval(frame, 25)
    function frame() {
        if(width >= 100){
            clearInterval(intervalId)
        } else {
            width++
            progressbar.style.width = width + "%";
        }
    }
    setTimeout(()=>{
        popup.hidden = true

        if (chatbotOpenButton) {
            chatbotOpenButton.style.display = "flex"
        }
    }, 3000)
    

    console.log("Entrando na function")
    // setInterval(updateProgressBar, 1)
}