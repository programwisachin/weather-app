const apiKey = "18f1c13f384ff051b96d03639ddb470c";
let apiResponseData = {};
function displayResponseData() {

    const { name } = apiResponseData;
    const { description, icon } = apiResponseData.weather[0];
    const { temp, temp_min, temp_max, humidity } = apiResponseData.main;
    const { speed } = apiResponseData.wind;

    console.log(name, description, icon, temp_max, temp_min, temp, speed)

    document.querySelector(".weather_Place").innerText = `Weather in ${name}`;
    document.querySelector(".weather_Temperature").innerText = `${temp}°C`;
    document.querySelector(".weather_Img").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector(".weather_Description").innerText = `${description}`;
    document.querySelector(".weather_wind").innerText = `Wind: ${speed} kmph`;
    document.querySelector(".weather_humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector("h3").innerText = `Want to know more about ${name} 👇`;

}

function minMax(cold) {

    const { temp_min, temp_max } = apiResponseData.main;
    if (cold == true) {

        document.querySelector("h4").innerText = `Coldest Day`;
        document.querySelector(".weather_MinMaxTemp").innerText = `${temp_min}°C`
    }
    else {
        document.querySelector("h4").innerText = `Warmest Day`;
        document.querySelector(".weather_MinMaxTemp").innerText = `${temp_max}°C`;
    }
}

function storeData() {
    let tempData = {
        name: apiResponseData.name,
        warmest: apiResponseData.main.temp_max,
        coldest: apiResponseData.main.temp_min
    }
    let data = localStorage.getItem("past_pre")
    if (data == null) {
        dataObj = [];
        dataObj.push(tempData)
        localStorage.setItem("past_pre", JSON.stringify(dataObj))
    } else {
        dataObj = JSON.parse(data);

        filteredData = dataObj.filter((item) => item.name != tempData.name)

        if (filteredData === [] || filteredData === undefined || filteredData === null) {
            return;
        }
        else {
            filteredData.push(tempData)
            localStorage.setItem("past_pre", JSON.stringify(filteredData))
        }
    }

}

function showPastPreferences() {
    let pastData = localStorage.getItem("past_pre");
    if (pastData == null) {
        dataObj = [];
    } else {
        dataObj = JSON.parse(pastData);
    }
    let html = "";
    dataObj.forEach(function (element) {
        html += `<div class="past_weather_container">
        <div class="pastWeather_Place">${element.name}</div>
        <div class="pastWeather_Warm">Warmest Day:- ${element.warmest}°C</div>
        <div class="pastWeather_Cold">Coldest Day:- ${element.coldest}°C</div>
    </div>`;
    });
    document.querySelector(".past_weather").innerHTML = html;
}
function fetchApi(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            apiResponseData = data;
            displayResponseData();
            document.querySelector(".weather_MinMaxBtn").addEventListener("click", function () {
                isCold = document.querySelector(".weather_MinMaxInp").value;
                document.querySelector(".weather_MinMaxInp").value = ""
                if (isCold == "coldest") {
                    minMax(true)
                }
                else {
                    minMax(false)
                }
            })
            storeData()
            showPastPreferences()
        })
}


document.querySelector(".weather_Search_btn").addEventListener("click", function () {

    let city = document.querySelector(".weather_Search_inp").value
    fetchApi(city)
    document.querySelector(".weather_Search_inp").value = ""
    
})

fetchApi("tokyo")