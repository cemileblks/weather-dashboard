let searchForm = $('#search-form');
// let searchInput = $('#search-input');
let searchBtn = $('#search-button');
let searchHistory = $('#history');
let todayContainer = $('#today');
let forecastContainer = $('#forecast');

searchInput = "London"


searchForm.on("submit", function (event) {
    event.preventDefault();
    let searchInput = $('#search-input').val();
    getDataFromAPI(searchInput);
});

let getDataFromAPI = function (cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=17231fbdb2831307cb3be13a1cf98195&units=metric";


    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let weatherArray = data.list;
                
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
                iconElement.attr("style", "width: 100px;" )
                todayContainer.append(iconElement);


                let todayTemp = todayWeather.main.temp;
                let tempEl = $('<p>').addClass('card-text mt-2').text("Temp: " + todayTemp + "°C");
                todayContainer.append(tempEl);
                let todayWind = todayWeather.wind.speed;
                let windEl = $('<p>').addClass('card-text').text("Wind: " + (parseFloat(todayWind) * 3.6).toFixed(2) + " KPH");
                todayContainer.append(windEl);
                let todayHumidity = todayWeather.main.humidity;
                let humidityEl = $('<p>').addClass('card-text').text("Humidity: " + todayHumidity + "%");
                todayContainer.append(humidityEl);


            for (let i = 0; i < weatherArray.length; i++) {
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

                let wtemp = eachWeahterData.main.temp;
                let wtempEl = $('<p>').addClass('card-text mt-2').text("Temp: " + wtemp + "°C");
                cardBody.append(wtempEl);
                let wwind = eachWeahterData.wind.speed;
                let windEl = $('<p>').addClass('card-text').text("Wind: " + (parseFloat(wwind) * 3.6).toFixed(2) + " KPH");
                cardBody.append(windEl);
                let wHumidity = eachWeahterData.main.humidity;
                let humidityEl = $('<p>').addClass('card-text').text("Humidity: " + wHumidity + "%");
                cardBody.append(humidityEl);
        
            };





        })

};






