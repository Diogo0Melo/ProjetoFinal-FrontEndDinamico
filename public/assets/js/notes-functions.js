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
            .addEventListener("click", completed)
        });
        document.addEventListener("click", editContent);
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
    location.reload();
}
function completed(event) {
    console.log(event.target);
    // const botaoConcluir = document.getElementById(`btConcluir${i}`);
    // botaoConcluir.classList.toggle("tarefa-concluida");
    // if (botaoConcluir.textContent == "Concluir") {
    //     botaoConcluir.innerHTML = `Concluída <i class="bi bi-check-circle-fill"></i>`;
    // } else {
    //     botaoConcluir.innerHTML = "Concluir";
    // }
}
// function editContent(card){
//         document.getElementById("exampleModal").innerHTML=`
//         <div class="modal-dialog">
//         <div class="modal-content">
//             <div class="modal-header">
//                 <h1 class="modal-title fs-5" id="exampleModalLabel">
//                     Criar Nova Nota
//                 </h1>
//                 <button
//                     type="button"
//                     class="btn-close"
//                     data-bs-dismiss="modal"
//                     aria-label="Close"
//                 ></button>
//             </div>
//             <div class="modal-body">
//                 <form>
//                     <div class="mb-3">
//                         <label
//                             for="recipient-name"
//                             class="col-form-label"
//                             >Título:</label
//                         >
//                         <input
//                             type="text"
//                             class="form-control"
//                             id="note-title"
//                             value="${1+1}"
//                         />
//                     </div>
//                     <div class="mb-3">
//                         <label
//                             for="message-text"
//                             class="col-form-label"
//                             >Descrição:</label
//                         >
//                         <textarea
//                             rows="9"
//                             class="form-control"
//                             id="note-description"
//                         >${2+4}</textarea>
//                     </div>
//                 </form>
//             </div>
//             <div class="modal-footer">
//                 <button
//                     type="button"
//                     class="btn btn-secondary"
//                     data-bs-dismiss="modal"
//                 >
//                     Cancelar
//                 </button>
//                 <button
//                     type="button"
//                     id="add-note"
//                     class="btn btn-primary"
//                     data-bs-dismiss="modal"
//                 >
//                     Salvar
//                 </button>
//             </div>
//         </div>
//     </div>`
// }
export { loadNotesFromStorage, newNote };
