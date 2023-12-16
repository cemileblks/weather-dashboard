let searchForm = $('#search-form');
let searchBtn = $('#search-button');
let clearBtn = $('#clear-button');
let searchHistory = $('#history');
let todayContainer = $('#today');
let forecastContainer = $('#forecast');

let searchHistoryArray = JSON.parse(localStorage.getItem('CityName')) || [];

document.addEventListener("DOMContentLoaded", function () {
    displaySearchHistory();
});

let saveSearchHistory = function (cityName) {

    const lowercaseCityName = cityName.toLowerCase(); // convert to lowercase to check if it is already in the saved array

    if (searchHistoryArray.map(city => city.toLowerCase()).includes(lowercaseCityName)) {
        // If the city is already in the saved history, just return without adding it again
        return;
    };

    searchHistoryArray.push(cityName);

    localStorage.setItem('CityName', JSON.stringify(searchHistoryArray));

    displaySearchHistory();
};

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

clearBtn.on("click", function (event) {
    event.preventDefault();

    searchHistory.empty();
    searchHistoryArray = [];
    localStorage.setItem('CityName', JSON.stringify(searchHistoryArray));
    todayContainer.empty().removeClass('card');
    forecastContainer.empty();
});


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

let getDataFromAPI = function (cityName) {
    todayContainer.empty();
    forecastContainer.empty();



    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=17231fbdb2831307cb3be13a1cf98195&units=metric";


    fetch(queryURL)
        .then(function (response) {
            console.log(response);
            if (!response.ok){
                alert("City not found. Please check your spelling and try again");
                throw new Error("City not found"); //if user makes mistake while typing the city name
            }
            return response.json();
        })
        .then(function (data) {
            saveSearchHistory(cityName); // only save the result if the city name is spelled correctly and data can be retrived
            console.log(data);

            displayCurrentWeather(data);

            let weatherArray = data.list;

            for (let i = 0; i < weatherArray.length; i++) {
                let dataHour = dayjs(weatherArray[i].dt_txt).format('H');
                console.log("Hour: " + dataHour);
                if (dataHour === "12") { // to get one data for day at 12PM
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
                    console.log(iconCode);
                    let iconElement = $('<img>');
                    let iconurl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
                    iconElement.attr("src", iconurl);
                    cardBody.append(iconElement);

                    concatWeatherData(eachWeahterData, cardBody);

                    // let wtemp = eachWeahterData.main.temp;
                    // let wtempEl = $('<p>').addClass('card-text mt-2').text("Temp: " + wtemp + "°C");
                    // cardBody.append(wtempEl);
                    // let wwind = eachWeahterData.wind.speed;
                    // let windEl = $('<p>').addClass('card-text').text("Wind: " + (parseFloat(wwind) * 3.6).toFixed(2) + " KPH");
                    // cardBody.append(windEl);
                    // let wHumidity = eachWeahterData.main.humidity;
                    // let humidityEl = $('<p>').addClass('card-text').text("Humidity: " + wHumidity + "%");
                    // cardBody.append(humidityEl);
                }

            };

        })
        .catch(function (error) {
            console.error(error);
        });

};

let displayCurrentWeather = function (data) {

    let todayWeather = data.list[0];
    let dateoftoday = dayjs(todayWeather.dt_txt).format('D/M/YYYY');
    todayContainer.addClass('card-body card');
    let nameofCity = data.city.name;
    let cityNameEl = $('<h2>').addClass('card-title').text(nameofCity + " (" + dateoftoday + ")");
    todayContainer.append(cityNameEl);
    console.log(nameofCity);

    let iconCode = todayWeather.weather[0].icon;
    let iconElement = $('<img>');
    let iconurl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
    iconElement.attr("src", iconurl);
    iconElement.attr("style", "width: 100px;")
    todayContainer.append(iconElement);

    concatWeatherData(todayWeather, todayContainer);


    // let todayTemp = todayWeather.main.temp;
    // let tempEl = $('<p>').addClass('card-text mt-2').text("Temp: " + todayTemp + "°C");
    // todayContainer.append(tempEl);
    // let todayWind = todayWeather.wind.speed;
    // let windEl = $('<p>').addClass('card-text').text("Wind: " + (parseFloat(todayWind) * 3.6).toFixed(2) + " KPH"); // converts meters per second to KPH
    // todayContainer.append(windEl);
    // let todayHumidity = todayWeather.main.humidity;
    // let humidityEl = $('<p>').addClass('card-text').text("Humidity: " + todayHumidity + "%");
    // todayContainer.append(humidityEl);
};


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
