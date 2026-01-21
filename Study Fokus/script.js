const abrirModal = document.getElementById("abrirModal");
const fecharModal = document.getElementById("fecharModal");
const modal = document.getElementById("modal");
const inputMateria = document.getElementById("inputMateria");
const btnCriar = document.querySelector(".criarMateria");
const cardsContainer = document.querySelector(".cards")


let corEscolhida = ""
const botoesCor = document.querySelectorAll(".cor");

botoesCor.forEach( botao  => {
    botao.addEventListener("click", () =>{
        corEscolhida = botao.classList[1]
    botoesCor.forEach(b => b.classList.remove("ativo"))
    botao.classList.add("ativo")
});
});
// Evento para criar card
btnCriar.addEventListener("click", () => {
    // variavel input do valor
    const nome  = inputMateria.value.trim();
    // verificação 
    if(nome === ""){
        alert("Escreva algo!");
        return ;
    }
    if(!corEscolhida){
        alert("Escolha uma cor!")
        return ;
    }

    const novoCard = document.createElement("div");
    novoCard.classList.add("card", corEscolhida);
    novoCard.innerHTML = `<div class="iconcard"> <img  class="excluirCard" src="imagens/lixo-icon.png" alt="Imagem logo do card"></img></div>
        <h3 class="cardtitulo">${nome}</h3>
    

        ` ;
        const btnExcluir = novoCard.querySelector(".excluirCard")
        btnExcluir.addEventListener("click", () => {
            novoCard.remove()
        });
        cardsContainer.appendChild(novoCard)
        inputMateria.value = ""
        corEscolhida = ""
        botoesCor.forEach((b) => b.classList.remove("ativo"))
});

abrirModal.addEventListener("click", () => {
    modal.style.display = "flex";
});

fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fecha clicando fora
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

function carrinho() {
    
}