const abrirModal = document.getElementById("abrirModal");
const fecharModal = document.getElementById("fecharModal");
const modal = document.getElementById("modal");

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
