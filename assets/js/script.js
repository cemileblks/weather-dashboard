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

            let weather = data.list;
            // let temp = weather.main.temp + "°C"
            // let wind = weather.wind.speed
            // let humidity = weather.main.humidity

            // for (let i = 0; i < weather.length; i++) {

                let todayWeather = data.list[0];
                todayContainer.addClass('card-body card');
                let nameofCity = data.city.name;
                let cityNameEl = $('<h2>').addClass('card-title').text(nameofCity);
                todayContainer.append(cityNameEl);
                console.log(nameofCity);

                let todayTemp = todayWeather.main.temp;
                let tempEl = $('<p>').addClass('card-text mt-2').text(todayTemp + "°C");
                todayContainer.append(tempEl);
                let todayWind = todayWeather.wind.speed;
                let windEl = $('<p>').addClass('card-text').text(todayWind + "mph");
                todayContainer.append(windEl);
                let todayHumidity = todayWeather.main.humidity;
                let humidityEl = $('<p>').addClass('card-text').text(todayHumidity + "%");
                todayContainer.append(humidityEl);


                // const element = array[i];

            // }

            for (let i = 0; i < weather.length; i++) {
                let eachWeahterData = weather[i];

                let weatherElement = $('<div>').addClass('col');
                forecastContainer.append(weatherElement);

                let weatherCard = $('<div>').addClass('card dark-card');
                weatherElement.append(weatherCard);

                let cardBody = $('<div>').addClass('card-body');
                weatherCard.append(cardBody);

                let date = dayjs(eachWeahterData.dt_txt).format('D/M/YYYY');

                let dateEl = $('<h3>').addClass('card-title').text(date);
                cardBody.append(dateEl);


        
            };





        })

};






