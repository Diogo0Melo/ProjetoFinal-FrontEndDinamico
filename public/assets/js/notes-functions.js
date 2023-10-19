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
      <div class="d-flex flex-direction-row">
      <button class="btn btn-primary" id="btConcluir${++i}" >Concluir</button>
      <button class="btn btn-danger btn-primary" id="btExcluir" >Excluir</button>
      </div>
  </div> `;
        document
            .querySelector("#btConcluir" + i)
            .addEventListener("click", completed);
    });
}

async function newNote() {
    const title = document.querySelector("#note-title").value;
    const description = document.querySelector("#note-description").value;
    sec.innerHTML += `
    <div class="card cp">
    <div class="card-body" data-bs-toggle="modal" data-bs-target="#exampleModal">
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
        .addEventListener("click", completed);
    // document.querySelector("#btExcluir").addEventListener("click", removeNote);
}
function completed(event) {
    console.log(event.target);
    // botaoConcluir.classList.toggle("tarefa-concluida");
    // if (botaoConcluir.textContent == "Concluir") {
    //     botaoConcluir.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
    // } else {
    //     botaoConcluir.innerHTML = "Concluir";
    // }
}
export { loadNotesFromStorage, newNote };
