import './css/styles.css';
import Notiflix from 'notiflix';

import debounce from 'lodash.debounce';

// ==============================================================================
// import функції, яка здійснює GET запит
// ==============================================================================
import { fetchCountries } from './fetchCouuntries';

const DEBOUNCE_DELAY = 300;

// ==============================================================================
// Отримання DOM-елементів
// ==============================================================================

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// ==============================================================================
// Слухач подій на input
// ==============================================================================

searchInput.addEventListener('input', debounce(onSearchInput, 300));

// ==============================================================================
// Функція для друку повідомлень
// ==============================================================================

const MESSAGES = {
  failure: 'Oops, there is no country with that name',
  info: 'Too many matches found. Please enter a more specific name.',
};

function showNotification(type) {
  const message = MESSAGES[type];
  Notiflix.Notify[type](message);
}
// ==============================================================================
// Callback слухача input
// ==============================================================================

function onSearchInput(event) {
  const searchQuery = event.target.value;

  if (searchQuery === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }
  // Запит API
  fetchCountries(searchQuery)
    .then(countries => {
      countryList.innerHTML = '';
      if (countries.length > 10) {
        showNotification('info');
        return;
      }

      if (countries.length >= 1 && countries.length <= 10) {
        renderCountryInfo(countries);

        return;
      }
    })
    .catch(error => {
      showNotification('failure');
    });
}

// ==============================================================================
// Рендеринг web-сторінки
// ==============================================================================

function renderCountryInfo(countries) {
  console.log(countries); // Для Китаю :)
  if (countries.length === 1) {
    const [country] = countries;
    const { flags, name, capital, population, languages } = country;
    const languageList = Object.values(languages).join(', ');
    countryList.textContent = '';
    countryInfo.innerHTML = `
        <div>
          <h2><img src="${flags.svg}" alt="${name.official} flag"> ${
      name.official
    } </h2>
          <p><span class="label">Capital:</span> ${capital}</p>
          <p><span class="label">Population:</span> ${getNumber(population)}</p>
          <p><span class="label">Languages:</span> ${languageList}</p>
        </div>
      `;
  } else {
    countryInfo.textContent = '';
    countryList.innerHTML = countries.reduce((acc, { flags, name }) => {
      return `${acc}<li><h2><img src="${flags.svg}" alt="${name.official} flag"> ${name.official}</h2></li>`;
    }, '');
  }
}

// https://stackoverflow.com/questions/36734201/how-to-convert-numbers-to-million-in-javascript
function getNumber(num) {
  var units = ['Millions peoples', 'Billions peoples'];
  var unit = Math.floor((num / 1.0e1).toFixed(0).toString().length);
  var r = unit % 3;
  var x = Math.abs(Number(num)) / Number('1.0e+' + (unit - r)).toFixed(2);
  return x.toFixed(2) + ' ' + units[Math.floor(unit / 3) - 2];
}
