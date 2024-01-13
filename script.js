const API_KEY = 'cc0bf1be6417b773a6e0416808a7d224';
let main_section = null;
let city_input = null;
let myForm = null;

// take weather
function getWeatherData(lat, lon) {
    let xhr = new XMLHttpRequest();
    let api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&cnt=12&units=metric&lang=ua`
    let result = {};

    xhr.open('GET', api_url, false);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let responseData = JSON.parse(xhr.responseText);
            if (responseData.length == 0) {
                result['error'] = true;
                result['error_text'] = 'Error!';
            }
            else {
                result['error'] = false;
                result['list'] = responseData['list'];
            }
        }
        else {
            result['error'] = true;
            result['error_text'] = 'Error!';
        }
    };

    xhr.onerror = function () {
        result['error'] = true;
        result['error_text'] = 'Error!';
    };

    xhr.send();

    return result;
}

// get data about place
function getGeoData(city_name) {
    let xhr = new XMLHttpRequest();
    let api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${API_KEY}`
    let result = {};

    xhr.open('GET', api_url, false);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let responseData = JSON.parse(xhr.responseText);
            if (responseData.length == 0) {
                result['error'] = true;
                result['error_text'] = 'No such place!';
            }
            else {
                result['error'] = false;
                result['city_name'] = responseData[0]['local_names']['uk'];
                result['country'] = responseData[0]['country'];
                if ('state' in responseData[0])
                    result['state'] = responseData[0]['state'];
                result['lat'] = responseData[0]['lat'];
                result['lon'] = responseData[0]['lon'];
            }
        }
        else {
            result['error'] = true;
            result['error_text'] = 'Error!';
        }
    };

    xhr.onerror = function () {
        result['error'] = true;
        result['error_text'] = 'Error!';
    };

    xhr.send();

    return result;
}


function showMsg(message, parentElement) {
    let msgContainer = document.createElement('div');
    msgContainer.className = 'msg_container';

    let p = document.createElement('p');
    p.textContent = message;

    msgContainer.appendChild(p);
    parentElement.appendChild(msgContainer);

}

function createCard(weather_info, city_info) {
    let card_div = document.createElement('div');
    card_div.className = 'card';

    let card_container_div = document.createElement('div');
    card_container_div.className = 'card_container';
    card_div.appendChild(card_container_div);


    // header card name
    let card_header_div = document.createElement('div');
    card_header_div.className = 'card_header';
    card_container_div.appendChild(card_header_div);

    let card_header_p = document.createElement('p');
    card_header_p.textContent = city_info;
    card_header_div.appendChild(card_header_p);

    // body card
    let card_body_div = document.createElement('div');
    card_body_div.className = 'card_body';
    card_container_div.appendChild(card_body_div);

    
    // pictures
    let card_icon_img = document.createElement('img');
    card_icon_img.class = 'card_icon_img';
    card_icon_img.src = `http://openweathermap.org/img/wn/${weather_info.weather[0].icon}@2x.png`;
    card_icon_img.alt = 'icon';
    
    let card_icon_div = document.createElement('div');
    card_icon_div.className = 'card_icon';
    
    card_icon_div.appendChild(card_icon_img);
    card_body_div.appendChild(card_icon_div);


    
    // textssss
    let date_time_p = document.createElement('p');
    date_time_p.textContent = `Date/Time: ${weather_info.dt_txt}`;
    
    let description_p = document.createElement('p');
    description_p.textContent = `Description: ${weather_info.weather[0].description}`;
    
    let temp_p = document.createElement('p');
    temp_p.textContent = `Temperature: ${weather_info.main.temp} C`;
    
    let feels_like_p = document.createElement('p');
    feels_like_p.textContent = `Feel like: ${weather_info.main.feels_like} C`;
    
    let card_fields = document.createElement('div');
    card_fields.className = 'card_fields';
    card_fields.appendChild(date_time_p);
    card_fields.appendChild(description_p);
    card_fields.appendChild(temp_p);
    card_fields.appendChild(feels_like_p);

    card_body_div.appendChild(card_fields);
    
    return card_div;
}


function formSubmit(event) {
    event.preventDefault();
    let city_name = city_input.value;

    //
    if (city_name === '') {
        return;
    }

    // после поиска очищаем поле ввода
    city_input.value = '';

    // очищаем мэйн
    while (main_section.firstChild) {
        main_section.removeChild(main_section.firstChild);
    }

    let geo = getGeoData(city_name);
    console.log(geo);

    if (geo['error'] == true) {
        showMsg(geo.error_text, main_section);
        return;
    }

    let city_info;
    if ('state' in geo)
        city_info = `${geo.city_name} | ${geo.country} | ${geo.state}`;
    else
        city_info = `${geo.city_name} | ${geo.country}`;


        let weather_list = getWeatherData(geo.lat, geo.lon);
    console.log(weather_list);

    if (weather_list['error'] == true) {
        showMsg(weather_list.error_text, main_section);
        return;
    }


    // output
    for (let index = 0; index < weather_list.list.length; index++) {
        const weather_info = weather_list.list[index];
        main_section.appendChild(createCard(weather_info, city_info));
    }

}


// load page
document.addEventListener('DOMContentLoaded', function () {
    myForm = document.getElementById('search_form');
    myForm.addEventListener('submit', formSubmit);
    main_section = document.getElementById('main_section');
    city_input = document.getElementById('search_input');
});