import { getInfosFromDB, updateUserInDB } from "./firebase.js";

const sec = document.getElementById("police");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
let userInfos = JSON.parse(localStorage.getItem(userID));
let i = 0;
async function loadNotesFromStorage() {
    if (!userInfos) {
        await getInfosFromDB(userID);
        userInfos = JSON.parse(localStorage.getItem(userID));
    }

    userInfos.notes.forEach((note) => {
        sec.innerHTML += `
            <div class="card cp">
            <div class="card-body" data-bs-toggle="modal" data-bs-target="#exampleModal">
              <h5 class="card-title">${note.title}</h5>
              <p class="card-text">${note.description}</p>
                <div class="card-footer">Ultima modificação - 18/10</div>
              </div>
              <div class="d-flex flex-direction-row bt-container">
              </div>
          </div> `;
    });
    const cards = document.querySelectorAll("div.card.cp");
    cards.forEach((card) => {
        const btnConcluir = document.createElement("button");
        const btnExcluir = document.createElement("button");
        btnConcluir.classList.add("btn", "btn-primary");
        btnConcluir.innerHTML = "Concluir";
        btnExcluir.classList.add("btn", "btn-danger", "btn-primary");
        btnExcluir.innerHTML = "Excluir";
        const btnContainer = card.querySelector(".bt-container");
        btnContainer.appendChild(btnConcluir);
        btnContainer.appendChild(btnExcluir);
        btnConcluir.addEventListener("click", completedNote);
        btnExcluir.addEventListener("click", removeNote);
    });
}

async function newNote() {
    const title = document.querySelector("#note-title").value;
    const description = document.querySelector("#note-description").value;
    sec.innerHTML += `
    <div class="card cp">
    <div class="card-body" onclick="editContent(this)">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description}</p>
        <div class="card-footer">Ultima modificação - 18/10</div>
      </div>
      <div class="d-flex flex-direction-row">
      <button class="btn btn-primary" id="btConcluir${++i}" >Concluir</button>
      <button class="btn btn-danger btn-primary" id="btExcluir" >Excluir</button>
      </div>
  </div>
    `;
    if (!userInfos) {
        await getInfosFromDB(userID);
        userInfos = JSON.parse(localStorage.getItem(userID));
    }
    const note = {
        title,
        description,
    };
    userInfos.notes.push(note);
    localStorage.setItem(userID, JSON.stringify(userInfos));
    await updateUserInDB(userID, userInfos);
    document
        .querySelector("#btConcluir" + i)
        .addEventListener("click", completedNote);
    // document.querySelector("#btExcluir").addEventListener("click", removeNote);
    location.reload();
}
function completedNote(event) {
    event.target.classList.toggle("tarefa-concluida");
    if (event.target.textContent == "Concluir") {
        event.target.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
    } else if (event.target.textContent.includes("Concluída")) {
        event.target.innerHTML = "Concluir";
    }
}
function removeNote(event) {
    const card = event.target.parentNode.parentNode;
    const index = card.dataset.index;
    userInfos.notes.splice(index, 1);
    localStorage.setItem(userID, JSON.stringify(userInfos));
    card.remove();
}
export { loadNotesFromStorage, newNote };
