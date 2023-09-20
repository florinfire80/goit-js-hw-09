// Definim o funcție numită getRandomHexColor care generează o culoare aleatorie în format hexazecimal
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}

// Inițializăm o variabilă numită intervalId cu valoarea null; aceasta va fi utilizată pentru a urmări intervalul de generare a culorii de fundal
let intervalId = null;

// Căutăm și stocăm referința către butonul cu atributul data-start
const startButton = document.querySelector('[data-start]');

// Căutăm și stocăm referința către butonul cu atributul data-stop
const stopButton = document.querySelector('[data-stop]');

// Adăugăm un eveniment "click" pentru butonul "Start"
startButton.addEventListener('click', () => {
  // Verificăm dacă intervalId este null, ceea ce înseamnă că schimbarea culorii de fundal nu este activă
  if (!intervalId) {
    // Creăm un interval care va schimba culoarea de fundal o dată pe secundă
    intervalId = setInterval(() => {
      document.body.style.backgroundColor = getRandomHexColor(); // Schimbăm culoarea de fundal cu una aleatorie
    }, 1000);
    startButton.disabled = true; // Dezactivăm butonul "Start" pentru a preveni mai multe apăsări consecutive
  }
});

// Adăugăm un eveniment "click" pentru butonul "Stop"
stopButton.addEventListener('click', () => {
  // Verificăm dacă intervalId există (adică, schimbarea culorii de fundal este activă)
  if (intervalId) {
    clearInterval(intervalId); // Oprim intervalul care schimbă culorile
    intervalId = null; // Setăm intervalId înapoi la null pentru a arăta că schimbarea culorii de fundal este oprită
    startButton.disabled = false; // Activăm din nou butonul "Start" pentru a permite apăsarea acestuia
  }
});
