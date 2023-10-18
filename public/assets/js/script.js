const main = document.querySelector("main");
window.onload = function () {
    main.innerHTML = `<div class="card cp">
    <div class="card-body" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
        content.</p>
        <div class="card-footer">Ultima modificação - 18/10</div>
      </div>
      <button class="btn btn-primary" id="btConcluir" onclick="concluiu()">Concluir</button>
  </div>
  

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Título:</label>
                <input type="text" class="form-control" id="recipient-name">
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">Descrição:</label>
                <textarea rows="9" class="form-control" id="message-text"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

function concluiu() {
    const botaoConcluir = document.getElementById("btConcluir");
    botaoConcluir.classList.toggle("tarefa-concluida");
    if ((botaoConcluir.textContent = "Concluir")) {
        botaoConcluir.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
    } else if (
        (botaoConcluir.textContent = `Concluída <i class="bi bi-check-circle-fill"></i>`)
    ) {
        botaoConcluir.innerHTML = "Concluir";
    }
}
