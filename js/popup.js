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