import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

// import функції, яка здійснює GET запит
import { fetchCountries } from './api-service';

const DEBOUNCE_DELAY = 300;
// Отримання DOM-елементів

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Слухач подій на input

searchInput.addEventListener('input', debounce(onSearchInput, 300));

function onSearchInput(event) {
  const searchQuery = event.target.value.trim();
  if (searchQuery) {
    fetchCountries(searchQuery).then(markupCountries).catch(showFailure); // Запит API
  } else {
    removeMarkup();
  }
}

// ============================================================================
// Функції
// ============================================================================

const MESSAGES = {
  failure: 'Oops, there is no country with that name',
  info: 'Too many matches found. Please enter a more specific name.',
};

function showNotification(type) {
  const message = MESSAGES[type];
  Notiflix.Notify[type](message);
}

function removeMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function showFailure() {
  showNotification('failure');
  removeMarkup();
}

function markupCountries(countries) {
  removeMarkup();
  if (countries.length > 10) {
    showNotification('info');
    return;
  }

  if (countries.length >= 1 && countries.length <= 10) {
    renderCountryInfo(countries);
    return;
  }
}

// Рендеринг web-сторінки

function renderCountryInfo(countries) {
  const isSingleCountry = countries.length === 1;

  const markup = isSingleCountry
    ? `
      <div>
        <h2>
          <img src="${countries[0].flags.svg}" alt="${name.official} flag">
          ${countries[0].name.official}
        </h2>
        <p><span class="label">Capital:</span> ${countries[0].capital}</p>
        <p><span class="label">Population:</span> ${getNumber(
          countries[0].population
        )}</p>
        <p><span class="label">Languages:</span> ${Object.values(
          countries[0].languages
        ).join(', ')}</p>
      </div>
    `
    : countries.reduce((acc, { flags, name }) => {
        return `${acc}<li><h2><img src="${flags.svg}" alt="${name.official} flag"> ${name.official}</h2></li>`;
      }, '');

  isSingleCountry
    ? (countryInfo.innerHTML = markup)
    : (countryList.innerHTML = markup);
}

// https://stackoverflow.com/questions/36734201/how-to-convert-numbers-to-million-in-javascript

function getNumber(num) {
  const units = ['Thousand peoples', 'Millions peoples', 'Billions peoples'];
  const unit = Math.floor((num / 1.0e1).toFixed(0).toString().length);
  const r = unit % 3;
  const x = Math.abs(Number(num)) / Number('1.0e+' + (unit - r)).toFixed(2);
  return x.toFixed(2) + ' ' + units[Math.floor(unit / 3) - 1];
}
