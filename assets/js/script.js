let searchForm = $('#search-form');
let searchInput = $('#search-input');
let searchBtn = $('#search-button');
let searchHistory = $('#history');
let todayContainer = $('#today');
let forecastContainer = $('#forecast');

searchInput = "London"


searchForm.on("submit", function(event){
    event.preventDefault();
    searchInput = searchInput.val();
    getDataFromAPI(searchInput);
});

let getDataFromAPI= function(cityName){
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +  cityName + "&cnt=1&appid=17231fbdb2831307cb3be13a1cf98195&units=metric";


fetch(queryURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
};




