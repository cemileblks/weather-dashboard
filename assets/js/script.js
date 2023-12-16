//set variables to use throught the js
let searchForm = $('#search-form');
let searchBtn = $('#search-button');
let clearBtn = $('#clear-button');
let searchHistory = $('#history');
let todayContainer = $('#today');
let forecastContainer = $('#forecast');
// load the search history first
document.addEventListener("DOMContentLoaded", function () {
    displaySearchHistory();
});

//convert search history to workable array
let searchHistoryArray = JSON.parse(localStorage.getItem('CityName')) || [];

//fumction to save search history
let saveSearchHistory = function (cityName) {

    const lowercaseCityName = cityName.toLowerCase(); // convert to lowercase to check if it is already in the saved array

    if (searchHistoryArray.map(city => city.toLowerCase()).includes(lowercaseCityName)) {
        // If the city is already in the saved history, just return without adding it again
        return;
    };

    searchHistoryArray.push(cityName);

    localStorage.setItem('CityName', JSON.stringify(searchHistoryArray)); // convert to string to store it in the local storage

    displaySearchHistory();
};

// function to create buttons for each item on the search history
let displaySearchHistory = function () {
    searchHistory.empty(); // to avoid duplicate buttons

    searchHistoryArray.forEach(city => {
        let cityButton = $('<button>').addClass('btn btn-secondary city-search-button mt-2 form-control');
        cityButton.text(city);
        searchHistory.append(cityButton);
        cityButton.on("click", function () {
            getDataFromAPI(city); // load data for each button 
        });
    });
};

// button to clear search history
clearBtn.on("click", function (event) {
    event.preventDefault();

    searchHistory.empty();
    searchHistoryArray = [];
    localStorage.setItem('CityName', JSON.stringify(searchHistoryArray));
    // also clear any remaining search results
    todayContainer.empty().removeClass('card'); 
    forecastContainer.empty();
});

// when user submits their search input
searchForm.on("submit", function (event) {
    event.preventDefault();
    let searchInput = $('#search-input').val();

    if (!searchInput) {
        // if user gives an empty input
        alert("Please enter a city name");
        return; //returns before the empty button can be created
    }

    getDataFromAPI(searchInput);

    $('#search-input').val(''); // Clear the search input
});

// Main function to retrive data from the API
let getDataFromAPI = function (cityName) {
    //empty any previous results
    todayContainer.empty();
    forecastContainer.empty();

    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=17231fbdb2831307cb3be13a1cf98195&units=metric";

    fetch(queryURL)
        .then(function (response) {
            // see if user entered right information
            if (!response.ok){
                alert("City not found. Please check your spelling and try again");
                throw new Error("City not found"); //if user makes mistake while typing the city name
            }
            return response.json();
        })
        .then(function (data) {
            saveSearchHistory(cityName); // only save the result if the city name is spelled correctly and data can be retrived

            displayCurrentWeather(data); //call the function to display today's weather

            let weatherArray = data.list;

            for (let i = 0; i < weatherArray.length; i++) {

                // First get results at 12PM for each day so that the user is not presented with all 40 timestamps
                let dataHour = dayjs(weatherArray[i].dt_txt).format('H');

                if (dataHour === "12") {
                    let eachWeahterData = weatherArray[i];

                    //code for creating card for each weather data
                    let weatherElement = $('<div>').addClass('col');
                    forecastContainer.append(weatherElement);

                    let weatherCard = $('<div>').addClass('card text-bg-dark');
                    weatherElement.append(weatherCard);

                    let cardBody = $('<div>').addClass('card-body');
                    weatherCard.append(cardBody);

                    // using day js to create day format for each card
                    let date = dayjs(eachWeahterData.dt_txt).format('D/M/YYYY');
                    let dateEl = $('<h4>').addClass('card-title').text(date);
                    cardBody.append(dateEl);

                    // code for icon
                    let iconCode = eachWeahterData.weather[0].icon;
                    let iconElement = $('<img>');
                    let iconurl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
                    iconElement.attr("src", iconurl);
                    cardBody.append(iconElement);

                    concatWeatherData(eachWeahterData, cardBody);
                }
            };
        })
        .catch(function (error) {
            console.error(error);
        });
};

let displayCurrentWeather = function (data) {
    let todayWeather = data.list[0];

    // Set title for the main card with the city name and the date
    let dateoftoday = dayjs(todayWeather.dt_txt).format('D/M/YYYY');
    todayContainer.addClass('card-body card');
    let nameofCity = data.city.name;
    let cityNameEl = $('<h2>').addClass('card-title').text(nameofCity + " (" + dateoftoday + ")");
    todayContainer.append(cityNameEl);

    // Set larger icon for the main card
    let iconCode = todayWeather.weather[0].icon;
    let iconElement = $('<img>');
    let iconurl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
    iconElement.attr("src", iconurl);
    iconElement.attr("style", "width: 100px;")
    todayContainer.append(iconElement);

    //call function to display weather and other information
    concatWeatherData(todayWeather, todayContainer);
};

// Function for displaying weather content 
const concatWeatherData = function(array, container){
    let dataTemp = array.main.temp;
    let tempEl = $('<p>').addClass('card-text mt-2').text("Temp: " + dataTemp + "°C");
    container.append(tempEl);
    let dataWind = array.wind.speed;
    let windEl = $('<p>').addClass('card-text').text("Wind: " + (parseFloat(dataWind) * 3.6).toFixed(2) + " KPH"); // converts meters per second to KPH
    container.append(windEl);
    let dataHumidity = array.main.humidity;
    let humidityEl = $('<p>').addClass('card-text').text("Humidity: " + dataHumidity + "%");
    container.append(humidityEl);
};
