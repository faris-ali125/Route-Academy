var searchInput = document.getElementById('search');
var searchBtn = document.getElementById('searchBtn');
var containOne = document.getElementById('containOne'); 

async function getCurrentCity() {
  if ("geolocation" in navigator) {
      return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
              async (position) => {
                  const latitude = position.coords.latitude;
                  const longitude = position.coords.longitude;

                  // Use an API to get city from coordinates
                  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

                  try {
                      const response = await fetch(url);
                      const data = await response.json();

                      resolve(data.city); 
                  } catch (error) {
                      console.error("Error fetching city information:", error);
                      reject(error); 
                  }
              },
              (error) => {
                  console.error(`Error occurred: ${error.message}`);
                  reject(error); 
              },
              {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0,
              }
          );
      });
  } else {
      console.error("Geolocation is not supported by this browser.");
      throw new Error("Geolocation not supported.");
  }
}

async function getWeather(city) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=ecf72348724c4942b77201227241812&q=${city}`);
        
        if (!res.ok) {
            throw new Error(`City not found or API error: ${res.status}`);
        }

        const finalData = await res.json();

        // Optional: Check if data exists for the city
        if (finalData.error) {
            throw new Error(finalData.error.message);
        }

        return finalData;  // Return the weather data if no errors
    } catch (error) {
        console.error( error.message);
        return error.message;  // Return null in case of error
    }
}

async function getFutureWeather(city) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ecf72348724c4942b77201227241812&q=${city}&days=5`);
        
        if (!res.ok) {
            throw new Error(`City not found or API error: ${res.status}`);
        }

        const finalData = await res.json();

        // Optional: Check if data exists for the city
        if (finalData.error) {
            throw new Error(finalData.error.message);
        }

        return finalData;  // Return the weather data if no errors
    } catch (error) {
        console.error( error.message);
        return error.message;  // Return null in case of error
    }
}

function getDayName(dateString) {
  const date = new Date(dateString); 
  const options = { weekday: 'long' }; 
  const dayName = date.toLocaleDateString('en-US', options); 
  return dayName;
}

function createCards(
  dayName,
  shortDate,
  cityName,
  temp_c,
  icon,
  text,
  cloudPercentage,
  windSpeed,
  windDir,
  tomorowDay,
  tomorowDate,
  tomorowMaxtemp_c,
  tomorowMintemp_c,
  tomorowText,
  AfterTomorowDay,
  AfterTomorowDay,
  AfterTomorowDate,
  AfterTomorowMaxtemp_c,
  AfterTomorowMintemp_c
){
  containOne.innerHTML = `
        <div class="col-lg-4 editCol ">
                 <div class="card  w-80% pb-4 ">
                    <div class="head">
                      <span>${dayName}</span>
                      <span>${shortDate}</span>
                    </div>
                    <div class="body pb-2">
                      <span class="d-block mt-3 mb-3">${cityName}</span>

                      <p class="main"> ${temp_c} <sup>o</sup> C <img src="${icon}" alt="icon" class="ms-1"></p>

                      <p class="statu">${text}</p>
                      <span class="me-3"><img src="images/icon-umberella.png" alt="" class="me-1">${cloudPercentage} %</span>
                      <span class="me-3"><img src="images/icon-wind.png" alt="" class="me-1">${windSpeed} km/h</span>
                      <span class="me-3"><img src="images/icon-compass.png" alt="" class="me-1">${windDir}</span>
                    </div>
                </div>
        </div>

         <div class="col-lg-4 editCol text-center ">
                 <div class="card  w-80% pb-4 ">
                    <div class="head">
                      <span>${tomorowDay}</span>
                      <span>${tomorowDate}</span>
                    </div>

                    <div class="body pb-2">
                      <p class="main"><i class="fa-solid fa-cloud-moon-rain ms-2"></i></p>
                      <p class="mainy"> ${tomorowMaxtemp_c} <sup>o</sup> C</p>
                      <p class="small">  ${tomorowMintemp_c} <sup>o</sup> C</p>

                      <p class="statu">${tomorowText}</p>
                      
                    </div>
                </div>
              </div>

              <div class="col-lg-4 editCol text-center ">
                 <div class="card  w-80% pb-4 ">
                    <div class="head">
                      <span>${AfterTomorowDay}</span>
                      <span>${AfterTomorowDate}</span>
                    </div>

                    <div class="body pb-2">
                      <p class="main"><i class="fa-solid fa-cloud-moon-rain ms-2"></i></p>
                      <p class="mainy">  ${AfterTomorowMaxtemp_c} <sup>o</sup> C</p>
                      <p class="small">  ${AfterTomorowMintemp_c} <sup>o</sup> C</p>

                      <p class="statu">Partly cloudy</p>
                      
                    </div>
                </div>
              </div>
`
}

 async function displayData(city){
  if(city.length > 2){

    containOne.innerHTML = '';

    let cuApi = await getWeather(city);
    let FuApi = await getFutureWeather(city); // send request

    // console.log(cuApi);
       
    if( typeof cuApi === 'string'){

        console.log('city not found');

      }else{
        // console.log(cuApi.current);

        // ------------------------------------------------------------------------
        cityName = cuApi.location['name'];
        temp_c = cuApi.current['temp_c'];
        icon = cuApi.current.condition['icon'];
        text = cuApi.current.condition['text'];
        windSpeed = cuApi.current['wind_kph'];
        windDir = cuApi.current['wind_dir'];
        cloudPercentage = cuApi.current['cloud'];
        const today = new Date();  
        const year = today.getFullYear(); // Get the year (YYYY)
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month (1-12) and add leading zero if needed
        const day = String(today.getDate()).padStart(2, '0'); // Get the day (1-31) and add leading zero if needed
        const shortDate  = `${year}-${month}-${day}`;
        const dayName = getDayName(shortDate); 
        // ------------------------------------------------------------------------


        // ------------------------------------------------------------------------
        tomorowDate = FuApi.forecast.forecastday[1]['date'];
        tomorowDay = getDayName(tomorowDate);
        tomorowMaxtemp_c = FuApi.forecast.forecastday[1]['day']['maxtemp_c'];
        tomorowMintemp_c = FuApi.forecast.forecastday[1]['day']['mintemp_c'];
        tomorowText = FuApi.forecast.forecastday[1]['day'].condition['text'];           
        // ------------------------------------------------------------------------


        // ------------------------------------------------------------------------
        AfterTomorowDate = FuApi.forecast.forecastday[2]['date'];
        AfterTomorowDay = getDayName(AfterTomorowDate);
        AfterTomorowMaxtemp_c = FuApi.forecast.forecastday[2]['day']['maxtemp_c'];
        AfterTomorowMintemp_c = FuApi.forecast.forecastday[2]['day']['mintemp_c'];
        AfterTomorowText = FuApi.forecast.forecastday[2]['day'].condition['text'];           
        // ------------------------------------------------------------------------


        createCards(
          dayName,
          shortDate,
          cityName,
          temp_c,
          icon,
          text,
          cloudPercentage,
          windSpeed,
          windDir,
          tomorowDay,
          tomorowDate,
          tomorowMaxtemp_c,
          tomorowMintemp_c,
          tomorowText,
          AfterTomorowDay,
          AfterTomorowDay,
          AfterTomorowDate,
          AfterTomorowMaxtemp_c,
          AfterTomorowMintemp_c
         );

      }
  }

}




// Start Page
(async () => {
  try {
      const city = await getCurrentCity();    
      displayData(city);


    } catch (error) {
      window.alert("Could not fetch your current city:", error.message);
  }
})();



// When Input change
searchInput.addEventListener('input', async function (e) {
  e.preventDefault(); 
  
      let city = searchInput.value;
       displayData(city);

});



