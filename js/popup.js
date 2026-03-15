function openDialog(id){
    let dialog = document.getElementById(id)
    dialog.showModal()
}

function closeDialog(id){
    let dialog = document.getElementById(id)
    dialog.close()

    //Caso for o popup de observações, limpar os inputs.
    if(id="obs-popup"){
        document.getElementById("popup-n1").value = undefined
        document.getElementById("popup-n2").value = undefined
        document.getElementById("popup-observacao").value = null

        document.getElementById("popup-aluno").textContent = "Boletim de ..."
    }

}

let i = 0;
function showUpdatePopup(type, message){
    console.log("Function called")
    let popup = document.getElementById("update-popup");
    let icon = document.getElementById("popup-icon");
    let progressbar = document.getElementById("progress-bar")
    let messageDiv = document.getElementById("popup-message")

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
    let id = setInterval(frame, 25)
    function frame() {
        if(width >= 100){
            clearInterval(id)
            i = 0
        } else {
            width++
            progressbar.style.width = width + "%";
        }
    }
    setTimeout(()=>{
        popup.hidden = true
    }, 3000)
    

    console.log("Entrando na function")
    // setInterval(updateProgressBar, 1)
}