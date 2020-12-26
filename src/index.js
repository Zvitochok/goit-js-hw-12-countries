'use strict';
import countrySearch from './js_src/fetchCountries';
import oneCountry from './templates/templatesOneCountry.hbs';
import countryList from './templates/templatesManyCoutry.hbs'

import '@pnotify/core/dist/BrightTheme.css';
const { error } = require('@pnotify/core');

var debounce = require('lodash.debounce');

const searchForm = document.querySelector('.js-search-form');
const countryContainer = document.querySelector('.js-articles');


searchForm.addEventListener('input', debounce(countrySearchInputHandler, 500));

function countrySearchInputHandler(e) {
  e.preventDefault();
  clearCountryContainer();
   const searchQuery = e.target.value;
  
  
  countrySearch.fetchCountryes(searchQuery).then(data => {
    
      if (data.length > 10) {
          error({
              text: "Too many matches found. Please enter a more specific query!"
          });
      } else if (data.status === 404) {
        error({
          text: "No country has been found. Please enter a more specific query!"
      });
      } else if (data.length === 1) {
          buildListMarkup(data, oneCountry);
      } else if (data.length <= 10) {
          buildListMarkup(data, countryList);
      }
  })
  .catch(Error => {
      Error({
          text: "You must enter query parameters!"
      });
      console.log(Error)
  })
}

function buildListMarkup(countryes, template) {
  const markup = countryes.map(count => template(count)).join();
  countryContainer.insertAdjacentHTML('afterbegin', markup)
}

function clearCountryContainer() {
  countryContainer.innerHTML = '';
}