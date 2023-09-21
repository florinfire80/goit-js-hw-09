// Așteaptă ca documentul HTML să fie complet încărcat înainte de a executa codul
document.addEventListener('DOMContentLoaded', function () {
  // Selectează formularul cu id-ul 'promiseForm' și îl stochează în variabila 'promiseForm'
  const promiseForm = document.getElementById('promiseForm');

  // Definește o funcție numită 'createPromise' care primește 'position' și 'delay'
  function createPromise(position, delay) {
    // Returnează o promisiune care se va rezolva sau respinge după un anumit timp 'delay'
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Generează un număr aleator între 0 și 1
        const randomNumber = Math.random();
        const result = { position, delay };

        // Verifică dacă numărul generat este mai mic de 0.7 (70% probabilitate)
        if (randomNumber < 0.7) {
          // Dacă da, marchează promisiunea ca rezolvată și trimite rezultatul
          result.status = 'resolved';
          resolve(result);
        } else {
          // Dacă nu, marchează promisiunea ca respinsă și trimite rezultatul
          result.status = 'rejected';
          reject(result);
        }
      }, delay);
    });
  }

  // Definește un generator de promisiuni numit 'promiseGenerator'
  async function* promiseGenerator(amount, firstDelay, step) {
    for (let i = 1; i <= amount; i++) {
      const delay = firstDelay + (i - 1) * step;
      try {
        // Așteaptă rezolvarea sau respingerea unei promisiuni create cu 'createPromise'
        const result = await createPromise(i, delay);
        // Returnează rezultatul pentru generator
        yield result;
      } catch (error) {
        // Dacă promisiunea este respinsă, returnează eroarea pentru generator
        yield error;
      }
    }
  }

  // Adaugă un ascultător de eveniment pentru trimiterea formularului
  promiseForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Oprirea comportamentului implicit al formularului (trimiterea)

    // Creează o listă neordonată pentru afișarea rezultatelor
    const resultsList = document.createElement('ul');
    // Setează id-ul listei ca 'results'
    resultsList.id = 'results';
    // Adaugă lista la interiorul formularului
    promiseForm.appendChild(resultsList);

    // Obține datele din formular folosind FormData
    const formData = new FormData(promiseForm);
    const amount = parseInt(formData.get('amount'));
    const firstDelay = parseInt(formData.get('delay'));
    const step = parseInt(formData.get('step'));

    // Creează un generator de promisiuni pe baza datelor din formular
    const generator = promiseGenerator(amount, firstDelay, step);

    // Parcurge generatorul și afișează rezultatele
    for await (const result of generator) {
      const li = document.createElement('li');
      if (result.status === 'resolved') {
        // Dacă promisiunea este rezolvată, afișează mesajul cu verde
        li.textContent = `Promise ${result.position} resolved after ${result.delay} ms`;
        li.style.color = 'green';
      } else {
        // Dacă promisiunea este respinsă, afișează mesajul cu roșu
        li.textContent = `Promise ${result.position} rejected after ${result.delay} ms`;
        li.style.color = 'red';
      }
      // Adaugă elementul <li> la lista de rezultate
      resultsList.appendChild(li);
    }
  });
});
