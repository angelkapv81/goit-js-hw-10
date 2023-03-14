// ==============================================================================
//Функція здійснює GET запит API
// ==============================================================================

export function fetchCountries(name) {
  const API_URL = 'https://restcountries.com/v3.1/name/';
  const url = `${API_URL}${name}?fields=name,capital,population,flags,languages`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
