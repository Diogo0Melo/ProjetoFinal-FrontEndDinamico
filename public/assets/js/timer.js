const h = document.getElementById("hora");
const m = document.querySelector("#minute");
const s = document.getElementById("second");
const btnTimer = document.querySelector("#start-timer");
let timerInterval = null;

function iniciarContagemRegressiva() {
    const horaAlvo = document.getElementById("hora-alvo").value;
    const horaAlvoParts = horaAlvo.split(":");

    if (horaAlvoParts.length === 2) {
        const horaAlvoHr = parseInt(horaAlvoParts[0], 10);
        const horaAlvoMin = parseInt(horaAlvoParts[1], 10);

        if (!isNaN(horaAlvoHr) && !isNaN(horaAlvoMin)) {
            clearInterval(timerInterval);

            timerInterval = setInterval(function () {
                const k = new Date();
                const hr = k.getHours();
                const min = k.getMinutes();
                const sec = k.getSeconds();

                let horasRestantes = horaAlvoHr - hr;
                let minutosRestantes = horaAlvoMin - min;
                let segundosRestantes = 60 - sec;

                if (segundosRestantes === 60) {
                    minutosRestantes--;
                    segundosRestantes = 0;
                }

                if (minutosRestantes < 0) {
                    horasRestantes--;
                    minutosRestantes += 60;
                }

                if (horasRestantes < 0) {
                    clearInterval(timerInterval);
                    horasRestantes = 0;
                    minutosRestantes = 0;
                    segundosRestantes = 0;
                }

                h.textContent = horasRestantes.toString().padStart(2, "0");
                m.textContent = minutosRestantes.toString().padStart(2, "0");
                s.textContent = segundosRestantes.toString().padStart(2, "0");
            }, 1000);
        }
    }
}
btnTimer.addEventListener("click", iniciarContagemRegressiva);
