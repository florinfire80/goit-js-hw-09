
import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const randomNumber = Math.random(); // Generăm un număr între 0 și 1
    const result = { position, delay };

    setTimeout(() => {
      if (randomNumber < 0.3) {
        // Alegeți o probabilitate de 30% pentru respingere
        result.status = 'resolved';
        resolve(result);
      } else {
        result.status = 'rejected';
        reject(result);
      }
    }, delay);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const promiseForm = document.getElementById('promiseForm');

  promiseForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(promiseForm);
    const firstDelay = parseInt(formData.get('delay'));
    const step = parseInt(formData.get('step'));
    const amount = parseInt(formData.get('amount'));

    const promises = [];

    for (let i = 1; i <= amount; i++) {
      const delay = firstDelay + (i - 1) * step;
      promises.push(createPromise(i, delay));
    }

    try {
      const results = await Promise.all(promises);
      results.forEach(result => {
        if (result.status === 'resolved') {
          Notiflix.Notify.Success(
            `Promise ${result.position} resolved after ${result.delay} ms`
          );
        } else {
          Notiflix.Notify.Failure(
            `Promise ${result.position} rejected after ${result.delay} ms`
          );
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
});
