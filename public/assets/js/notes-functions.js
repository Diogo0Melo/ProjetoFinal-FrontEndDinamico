import { getInfosFromDB, updateUserInDB } from "./firebase.js";

const sec = document.getElementById("police");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
let userInfos = JSON.parse(localStorage.getItem(userID));
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
      <button class="btn btn-primary" id="btConcluir" onclick="concluiu()">Concluir</button>
  </div> `;
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
      <button class="btn btn-primary" id="btConcluir" onclick="concluiu()">Concluir</button>
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
}

export { loadNotesFromStorage, newNote };
