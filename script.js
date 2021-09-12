let apikey = 'f6cb19fd961ee982b415383918149e68';
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");
let api;
let audio;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser do not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "/Weather_icons/clear.svg";
            document.body.style.backgroundImage = "url('/Weather_condition_gifs/clearsky.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "100% 100%";
            audio = new Audio("/Weather_sounds/clear.mp3");
            audioloop(audio);

        }
        
        else if(id >= 200 && id <= 232){
            wIcon.src = "/Weather_icons/storm.svg";  
            document.body.style.backgroundImage = "url('/Weather_condition_gifs/stormy.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "100% 100%";
            audio = new Audio("/Weather_sounds/storm.mp3");
            audioloop(audio);
        }
        
        else if(id >= 600 && id <= 622){
            wIcon.src = "/Weather_icons/snow.svg";
            document.body.style.backgroundImage = "url('/Weather_condition_gifs/snowfall.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "100% 100%";
            audio = new Audio("/Weather_sounds/snow.mp3");
            audioloop(audio);
        }
        
        else if(id >= 701 && id <= 781){
            wIcon.src = "/Weather_icons/haze.svg";
            document.body.style.backgroundImage = "url('/Weather_condition_gifs/mist_foggy.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "100% 100%";
            audio = new Audio("/Weather_sounds/haze.wav");
            audioloop(audio);
        }
        
        else if(id >= 801 && id <= 804){
            wIcon.src = "/Weather_icons/cloud.svg";
            document.body.style.backgroundImage = "url('/Weather_condition_gifs/cloudy.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "100% 100%";
            audio = new Audio("/Weather_sounds/cloud.mp3");
            audioloop(audio);
        }
        
        else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "/Weather_icons/rain.svg";
            document.body.style.backgroundImage = "url('/Weather_condition_gifs/raindrop.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "100% 100%";
            audio = new Audio("/Weather_sounds/rain.wav"); 
            audioloop(audio);
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

function audioloop (audio) {

    if (typeof audio.loop == 'boolean') {
        audio.loop = true;
    }
    else {
        audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    audio.play();
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    audio.pause();
    document.body.style.backgroundImage = "none";
});