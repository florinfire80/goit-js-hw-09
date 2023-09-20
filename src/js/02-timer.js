import Notiflix from 'notiflix'; // Importăm librăria Notiflix pentru notificări
import flatpickr from 'flatpickr'; // Importăm Flatpickr pentru selectorul de date și ore
import 'flatpickr/dist/flatpickr.min.css'; // Importăm stilurile Flatpickr

function convertMs(ms) {
  const second = 1000; // Numărul de milisecunde într-o secundă
  const minute = second * 60; // Numărul de milisecunde într-un minut
  const hour = minute * 60; // Numărul de milisecunde într-o oră
  const day = hour * 24; // Numărul de milisecunde într-o zi

  const days = Math.floor(ms / day); // Calculăm numărul de zile
  const hours = Math.floor((ms % day) / hour); // Calculăm numărul de ore
  const minutes = Math.floor(((ms % day) % hour) / minute); // Calculăm numărul de minute
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); // Calculăm numărul de secunde

  return { days, hours, minutes, seconds }; // Returnăm obiectul cu timpul rămas
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0'); // Adăugăm un zero în față dacă valoarea are un singur caracter
}

function updateTimerFields(days, hours, minutes, seconds) {
  // Actualizăm elementele HTML cu valorile corespunzătoare
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

let intervalId; // Variabila pentru stocarea ID-ului intervalului

function countdown(eventDate) {
  intervalId = setInterval(() => {
    const currentDate = new Date(); // Obținem data curentă
    const timeDifference = eventDate - currentDate; // Calculăm diferența de timp

    if (timeDifference <= 0) {
      clearInterval(intervalId); // Oprim cronometrul dacă diferența este mai mică sau egală cu zero
      updateTimerFields(0, 0, 0, 0); // Actualizăm afișarea cu 0
    } else {
      const { days, hours, minutes, seconds } = convertMs(timeDifference); // Calculăm valorile zilelor, orelor, minutelor și secundelor rămase
      updateTimerFields(days, hours, minutes, seconds); // Actualizăm afișarea cu noile valori
    }
  }, 1000); // Intervalul de actualizare este de 1000 de milisecunde (1 secundă)
}

document.addEventListener('DOMContentLoaded', function () {
  let startButton = document.querySelector('[data-start]'); // Obținem butonul "Start" din DOM
  startButton.disabled = true; // Dezactivăm butonul "Start" inițial

  let isCountdownStarted = false; // Variabilă pentru a verifica dacă cronometrul a fost pornit

  const dateInput = flatpickr('#datetime-picker', {
    // Inițializăm Flatpickr pentru input-ul cu id-ul "datetime-picker"
    enableTime: true, // Permitem selectarea orei
    time_24hr: true, // Folosim formatul 24 de ore pentru ora
    defaultDate: new Date(), // Data și ora implicită este data și ora curentă
    minuteIncrement: 1, // Incrementul pentru selectarea minutelor
    onClose: function (selectedDates, dateStr) {
      // Funcția care se apelează la închiderea calendarului
      if (selectedDates.length > 0) {
        // Verificăm dacă a fost selectată o dată
        const selectedDate = selectedDates[0]; // Obținem data selectată
        const currentDate = new Date(); // Obținem data curentă

        if (selectedDate <= currentDate) {
          Notiflix.Notify.failure('Please choose a date in the future'); // Afișăm notificare de eroare cu Notiflix
          startButton.disabled = true; // Dezactivăm butonul "Start" dacă data este în trecut
        } else {
          startButton.disabled = false; // Activăm butonul "Start" pentru o dată validă în viitor
          if (isCountdownStarted) {
            clearInterval(intervalId); // Oprim orice numărătoare anterioară dacă există
          }
          isCountdownStarted = false; // Setăm flag-ul pentru a ține evidența pornirii cronometrului
        }
      }
    },
  });

  startButton.addEventListener('click', () => {
    const selectedDate = dateInput.selectedDates[0]; // Obținem data selectată de utilizator din Flatpickr

    if (selectedDate && !isCountdownStarted) {
      // Verificăm dacă avem o dată validă și dacă cronometrul nu a fost pornit încă
      countdown(selectedDate); // Pornim cronometrul
      isCountdownStarted = true; // Setăm flag-ul pentru a indica că cronometrul a fost pornit
    }
  });
});
