const ctx = document.getElementById('myChart').getContext('2d');
const chartContainer = document.querySelector("chart-container");
const individualCountriesContainer = document.querySelector(".individual-countries-container");
const asiaBtn = document.querySelector(".asia-btn");
const europeBtn = document.querySelector(".europe-btn");
const africaBtn = document.querySelector(".africa-btn");
const americasBtn = document.querySelector(".americas-btn");
asiaBtn.addEventListener("click",()=> fetchCovidInfoByContinent("asia"));
europeBtn.addEventListener("click",()=> fetchCovidInfoByContinent("europe"));
africaBtn.addEventListener("click",()=> fetchCovidInfoByContinent("africa"));
americasBtn.addEventListener("click",()=> fetchCovidInfoByContinent("americas"));
const confirmedBtn = document.querySelector(".confirmed-btn");
const deathsBtn = document.querySelector(".deaths-btn");
const recoveredBtn = document.querySelector(".recovered-btn");
const criticalBtn = document.querySelector(".critical-btn");
confirmedBtn.addEventListener("click", getConfirmedInfo);//each button calls this func with current continent info
deathsBtn.addEventListener("click", getDeathsInfo);
recoveredBtn.addEventListener("click", getRecoveredInfo);
criticalBtn.addEventListener("click", getCriticalInfo);


const covidByCountriesEndpoint = 'https://corona-api.com/countries';
const countriesByRegionEndpoint = 'restcountries.herokuapp.com/api/v1/region/';
const currentContinentInfo = {}; //chosen continent info: name, and list contains all countries objects
const allContinentsFetched = [];
const continentList = ["asia", "europe", "africa", "americas"];
//continent[0] will match the allContinentsFetched[0] array
const allcountries = [];

//first-fetching all countries by continents
async function sendingAllContinentsToFetchInfo() {
    try {
        // console.log("in 1");
        for(let i = 0; i <continentList.length; i++) {
            await fetchContinentInfo(continentList[i]);
        }
    }
    catch(err) {
        console.log(err);
    }
}
sendingAllContinentsToFetchInfo();

//fetching covid info of all countries by continent//
async function fetchCovidInfoByContinent(continent) {
    let continentIndex; //the current continent place in continenList
    const checkForIndex = continent===continentList[0] ? continentIndex = 0 : 
                          continent===continentList[1] ? continentIndex = 1 :
                          continent===continentList[2] ? continentIndex = 2 : 
                          continent===continentList[3] ? continentIndex = 3: -1;
    let response;
    let parsedData;
    currentContinentInfo.name = continent;
    currentContinentInfo.continentIndex = continentIndex;
    currentContinentInfo.countries = [];
    // console.log(continent);
    // console.log(allContinentsFetched[continentIndex]);
    try {
        response = await fetch(`${covidByCountriesEndpoint}`);
        parsedData = await response.json(); //parsedData.data[x] to get a specific country
        // console.log(parsedData);
        for(let i = 0; i < parsedData.data.length; i++) {
            if(allContinentsFetched[continentIndex].includes(parsedData.data[i].name)) {
                const obj = {}; //inserting all relevant info on each country in the current continent
                obj.name = parsedData.data[i].name;
                obj.confirmed = parsedData.data[i].latest_data.confirmed;
                obj.newCases = parsedData.data[i].today.confirmed;
                obj.deaths = parsedData.data[i].latest_data.deaths;
                obj.newDeaths = parsedData.data[i].today.deaths;
                obj.recovered = parsedData.data[i].latest_data.recovered;
                obj.critical = parsedData.data[i].latest_data.critical;

                currentContinentInfo.countries.push(obj);
            }
        }
        console.log(currentContinentInfo);
    }
    catch (err) {
        console.log(err);
    }
}

//fetching continent info and storing each continent in allContinentsFetached for access later
async function fetchContinentInfo(continent) {
    // console.log("in 2");
    let response;
    let data;
    try {
        response = await fetch(`https://cors-anywhere.herokuapp.com/restcountries.herokuapp.com/api/v1/region/${continent}`);
        data = await response.json();
        // console.log(data);
        const arr = [];

        for (let i = 0; i < data.length; i++) { //inserting all the countries names in the current continent to array
            arr.push(data[i].name.common);
            allcountries.push(data[i].name.common);
        }

        allContinentsFetched.push(arr); //pushing that array to the array that contains all continents arrays
        // console.log(allContinentsFetched);
    }
    catch (err) {
        console.log(err);
    }
}

//getting all the stats by the button the user presses on//
function getConfirmedInfo() {
    const dataTopresent = [];
    const countriesToPresent = [];
    for (let i = 0; i<currentContinentInfo.countries.length; i++) {
        dataTopresent.push(currentContinentInfo.countries[i].confirmed); 
        countriesToPresent.push(currentContinentInfo.countries[i].name);
    }

    displayChart(dataTopresent, countriesToPresent);
}

function getDeathsInfo() {
    const dataTopresent = [];
    const countriesToPresent = [];
    for (let i = 0; i<currentContinentInfo.countries.length; i++) {
        dataTopresent.push(currentContinentInfo.countries[i].deaths); 
        countriesToPresent.push(currentContinentInfo.countries[i].name);
    }
    
    displayChart(dataTopresent,countriesToPresent);
}

function getRecoveredInfo() {
    const dataTopresent = [];
    const countriesToPresent = [];
    for (let i = 0; i<currentContinentInfo.countries.length; i++) {
        dataTopresent.push(currentContinentInfo.countries[i].recovered); 
        countriesToPresent.push(currentContinentInfo.countries[i].name);
    }

    displayChart(dataTopresent, countriesToPresent);

}

function getCriticalInfo() {
    const dataTopresent = [];
    const countriesToPresent = [];
    for (let i = 0; i<currentContinentInfo.countries.length; i++) {
        dataTopresent.push(currentContinentInfo.countries[i].critical); 
        countriesToPresent.push(currentContinentInfo.countries[i].name);
    }
    displayChart(dataTopresent,countriesToPresent);
}


function displayChart(dataTopresent,countriesToPresent)
{
    if(currentContinentInfo.name) {  //if the currentContinet obj isn't empty 
    const labels = ["confirmed", "deaths", "recovered", "critical"];
    let clickedLabel;
    const chosenLabel = event.currentTarget.classList.contains("confirmed-btn")? clickedLabel = 0
                        : event.currentTarget.classList.contains("deaths-btn")? clickedLabel = 1
                        : event.currentTarget.classList.contains("recovered-btn")? clickedLabel = 2
                        : clickedLabel = 3;
    const randomR = Math.floor(Math.random() * 256);  // returns a random integer from 0 to 100
    const randomG = Math.floor(Math.random() * 256);  // returns a random integer from 0 to 100
    const randomB = Math.floor(Math.random() * 256);  // returns a random integer from 0 to 100
    const myChart = new Chart(ctx, {
        type: 'line', //type of chart
        data: { //what we populate the chart with
          labels: countriesToPresent, 
          datasets: [{
            label: labels[clickedLabel],
            data: dataTopresent,
            backgroundColor: `rgba(${randomR}, ${randomG}, ${randomB}, 0.4)`
          }]
        },
        options: {
            events: ['click'],
        }
      });
      displayCountriesBelowChart();
    }
    else {
        console.log("Choose continent first.");
    }
}

function displayCountriesBelowChart() {
    individualCountriesContainer.innerHTML = ""; //clean container
    for(let i = 0; i <currentContinentInfo.countries.length; i++) {
        const countrySpan = document.createElement("span");
        countrySpan.classList.add("country-span");
        countrySpan.textContent = currentContinentInfo.countries[i].name;
        countrySpan.addEventListener("click", presentSpecificCountryStats);
        individualCountriesContainer.appendChild(countrySpan);
    }
}

function presentSpecificCountryStats() {

}

