const ctx = document.getElementById('myChart').getContext('2d');
const chartContainer = document.querySelector(".chart-container");
const countriesStatsContainer = document.querySelector(".countries-stats-container");
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
        console.log(parsedData);
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
    countriesStatsContainer.innerHTML = "";
    chartContainer.style.display = "block";
    const labels = ["confirmed", "deaths", "recovered", "critical"];
    let clickedLabel;
    Chart.defaults.global.defaultFontColor = 'black';
    const chosenLabel = event.currentTarget.classList.contains("confirmed-btn")? clickedLabel = 0
                        : event.currentTarget.classList.contains("deaths-btn")? clickedLabel = 1
                        : event.currentTarget.classList.contains("recovered-btn")? clickedLabel = 2
                        : clickedLabel = 3;
    const randomR = Math.floor(Math.random() * 256);  
    const randomG = Math.floor(Math.random() * 256);  
    const randomB = Math.floor(Math.random() * 256);  
    const myChart = new Chart(ctx, {
        type: 'line', //type of chart
        data: { //what we populate the chart with
          labels: countriesToPresent, 
          datasets: [{
            label: labels[clickedLabel],
            data: dataTopresent,
            backgroundColor: `rgba(${randomR}, ${randomG}, ${randomB}, 0.4)`,
          }]
        },
        options: {
            events: ['click'],
            legend: {
                labels: {
                    fontColor: "black",
                }
            }
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
        countrySpan.addEventListener("click", ()=>presentSpecificCountryStats(currentContinentInfo.countries[i]));
        individualCountriesContainer.appendChild(countrySpan);
    }
}

function presentSpecificCountryStats(countryobj) {
    console.log(countryobj);
    chartContainer.style.display = "none";
    countriesStatsContainer.innerHTML = "";

    const totalCases = document.createElement("div");
    totalCases.classList.add("country-stats");
    const totalCasesH2 = document.createElement("h2");
    totalCasesH2.textContent = `${countryobj.name} total cases:`;
    const totalCasesH3 = document.createElement("h3");
    totalCasesH3.textContent = countryobj.confirmed;
    totalCases.appendChild(totalCasesH2);
    totalCases.appendChild(totalCasesH3);
    countriesStatsContainer.appendChild(totalCases);

    const deaths = document.createElement("div");
    deaths.classList.add("country-stats");
    const deathsH2 = document.createElement("h2");
    deathsH2.textContent = `${countryobj.name} deaths:`;
    const deathsH3 = document.createElement("h3");
    deathsH3.textContent = countryobj.deaths;
    deaths.appendChild(deathsH2);
    deaths.appendChild(deathsH3);
    countriesStatsContainer.appendChild(deaths);

    const recovered = document.createElement("div");
    recovered.classList.add("country-stats");
    const recoveredH2 = document.createElement("h2");
    recoveredH2.textContent = `${countryobj.name} recovered:`;
    const recoveredH3 = document.createElement("h3");
    recoveredH3.textContent = countryobj.recovered;
    recovered.appendChild(recoveredH2);
    recovered.appendChild(recoveredH3);
    countriesStatsContainer.appendChild(recovered);

    const newCases = document.createElement("div");
    newCases.classList.add("country-stats");
    const newCasesH2 = document.createElement("h2");
    newCasesH2.textContent = `${countryobj.name} new cases:`;
    const newCasesH3 = document.createElement("h3");
    newCasesH3.textContent = countryobj.newCases;
    newCases.appendChild(newCasesH2);
    newCases.appendChild(newCasesH3);
    countriesStatsContainer.appendChild(newCases);

    const newDeaths = document.createElement("div");
    newDeaths.classList.add("country-stats");
    const newDeathsH2 = document.createElement("h2");
    newDeathsH2.textContent = `${countryobj.name} new deaths:`;
    const newDeathsH3 = document.createElement("h3");
    newDeathsH3.textContent = countryobj.newDeaths;
    newDeaths.appendChild(newDeathsH2);
    newDeaths.appendChild(newDeathsH3);
    countriesStatsContainer.appendChild(newDeaths);

    const critical = document.createElement("div");
    critical.classList.add("country-stats");
    const criticalH2 = document.createElement("h2");
    criticalH2.textContent = `${countryobj.name} critical:`;
    const criticalH3 = document.createElement("h3");
    criticalH3.textContent = countryobj.critical;
    critical.appendChild(criticalH2);
    critical.appendChild(criticalH3);
    countriesStatsContainer.appendChild(critical);

}
