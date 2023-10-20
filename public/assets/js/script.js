import { loadNotesFromStorage, newNote, editContent } from "./notes-func.js";

const main = document.querySelector("main");
const userID = JSON.parse(sessionStorage.getItem("@user")).uid;
const userInfos = JSON.parse(localStorage.getItem(userID));
// const sec = document.getElementById("police");
// for (let i = 0; i < 5; i++) {
//     sec.innerHTML += `
// <div class="card" id="cardCarregamento" aria-hidden="true">
//   <div class="card-body">
//       <h5 class="card-title placeholder-glow">
//           <span class="placeholder col-6"></span>
//       </h5>
//       <p class="card-text placeholder-glow">
//           <span class="placeholder col-7"></span>
//           <span class="placeholder col-4"></span>
//           <span class="placeholder col-4"></span>
//           <span class="placeholder col-6"></span>
//           <span class="placeholder col-8"></span>
//       </p>
//       <a
//           class="btn btn-primary disabled placeholder col-6"
//           aria-disabled="true"
//       ></a>
//   </div>
// </div>`;
// }

function createFirstNoteIconOrNoteContainer() {
    const icon = document.querySelector(".iconizao");
    if (userInfos?.notes.length > 0) {
        const sec = document.getElementById("police");
        sec.removeAttribute("hidden");
        icon.setAttribute("hidden", "");
        return;
    }
}
function logout(event) {
    event.preventDefault();
    sessionStorage.removeItem("@visited");
    sessionStorage.removeItem("@user");
    location.reload();
}
window.onload = async () => {
    const exampleModal = document.querySelector("#exampleModal");
    const btnAddNote = document.querySelector("#add-note");
    const btnLogout = document.querySelector("#logout");
    btnAddNote.addEventListener("click", newNote);
    btnLogout.addEventListener("click", logout);
    exampleModal.addEventListener("show.bs.modal", editContent);
    exampleModal.addEventListener("hide.bs.modal", () => location.reload());
    createFirstNoteIconOrNoteContainer();
    await loadNotesFromStorage();
};
