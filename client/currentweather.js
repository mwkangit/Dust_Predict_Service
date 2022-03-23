function url(city,API_KEY){
    const getJSON = function(url,callback){
        const xhr = new XMLHttpRequest();
        xhr.open('GET',url,true);
        xhr.responseType = 'json';
        xhr.onload = function(){
            const status = xhr.status;
            if(status === 200){
                callback(null,xhr.response);
            } else {
                callback(status,xhr.response);
            }
        };
        xhr.send();
    };
    getJSON(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    function(err,data) {
        if(err!==null){
            alert('오류발생'+err);
        } else{
            loadWeather(data);
        }
    });
    
    function loadWeather(data){
        let location = document.getElementById('location');
        let currentTime = document.getElementById('current-time');
        let currentTemp = document.getElementById('current-temp');
        let feelsLike = document.getElementById('feels-like');
        let weather_description = document.getElementById('weather-description');
        let wind_speed = document.getElementById('wind-speed');
        let cloud = document.getElementById('cloud');
        let icon = document.querySelector('icon');
        let weatherIcon = data.weather[0].icon;
    
        let date = new Date();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
    
    
    
    
        location.innerHTML = '';
        location.innerHTML += "지역 : "+data.name;
        currentTime.innerHTML = '';
        currentTime.innerHTML += `현재 시간 : ${month}월 ${ day}일 ${hours}:${minutes}`;
        currentTemp.innerHTML = '';
        currentTemp.innerHTML += `현재 온도 : ${data.main.temp}도`;
        feelsLike.innerHTML = '';
        feelsLike.innerHTML += `체감 온도 : ${data.main.feels_like}도`;
        weather_description.innerHTML = '';
        weather_description.innerHTML += `날씨 : ${data.weather[0].main}`;
        wind_speed.innerHTML = '';
        wind_speed.innerHTML = `풍속 : ${data.wind.speed}ms`;
        cloud.innerHTML = '';
        cloud.innerHTML += `구름 : ${data.clouds.all}%`;
        //icon.innerHTML = '';
        //icon.innerHTML += `<img src='http://openweathermap.org/img/wn/${weatherIcon}.png' > `;
    
    }

}



