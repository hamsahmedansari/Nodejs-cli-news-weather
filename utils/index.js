const request = require("request");
const api = require("../api");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");

const getRegion = city =>
  new Promise((resolve, reject) => {
    if (city != "undefined") {
      return resolve({ city });
    }
    console.log("=> City Not Mention Getting Result of Your Location");
    request(api.ipGeolocation, (err, res, body) => {
      if (err) return reject(err);
      const newRes = JSON.parse(body);
      if (!newRes) return reject(err);
      const regionDetails = {
        status: res.statusCode,
        continent: newRes.continent_name,
        country: newRes.country_name,
        provence: newRes.state_prov,
        district: newRes.district,
        city: newRes.city,
        zipcode: newRes.zipcode,
        location: {
          latitude: newRes.latitude,
          longitude: newRes.longitude
        }
      };
      resolve(regionDetails);
    });
  });

const getCityKey = city =>
  new Promise((resolve, reject) => {
    request(api.cities + "&q=" + city, (err, res, body) => {
      if (err) return reject(err);
      const newRes = JSON.parse(body)[0];

      if (!newRes) return reject("City Not Found ----> " + city);
      const CityObj = {
        status: res.statusCode,
        key: newRes.Key,
        continent: newRes.Region.EnglishName,
        country: newRes.Country.EnglishName,
        provence: newRes.AdministrativeArea.EnglishName,
        city: newRes.EnglishName,
        location: {
          latitude: newRes.GeoPosition.Latitude,
          longitude: newRes.GeoPosition.Longitude
        }
      };
      resolve(CityObj);
    });
  });

const getWether = city =>
  new Promise((resolve, reject) => {
    getCityKey(city)
      .then(res => {
        const City = res;
        request(
          api.weather + City.key + "?apikey=" + api.ACCUWEATHER_KEY,
          (err, res, body) => {
            if (err) return reject(err);
            const newRes = JSON.parse(body)[0];
            if (!newRes) return reject("Unable to Get weather of " + city);
            const weatherObj = {
              City,
              forcast: newRes.WeatherText,
              isDay: newRes.IsDayTime,
              temperature: {
                c: newRes.Temperature.Metric.Value,
                f: newRes.Temperature.Imperial.Value
              }
            };
            resolve(weatherObj);
          }
        );
      })
      .catch(err => reject(err));
  });

const getNews = country =>
  new Promise((resolve, reject) => {
    request(
      api.newsApi + country + "&apiKey=" + api.NEWS_KEY,
      (err, res, body) => {
        if (err) return reject(err);
        const newRes = JSON.parse(body);
        if (!newRes) return reject("News Not Found ----> " + country);
        const newsObj = newRes.articles;
        resolve(newsObj);
      }
    );
  });

const getDetails = (param = null) => {
  debugger;
  getRegion(param)
    .then(cityRes => {
      const { city } = cityRes;
      console.log(`=> Selected City : ${city} `);
      console.log(`=> Getting Weather of ${city} `);
      getWether(city).then(weatherRes => {
        console.log(`=> Weather of ${city} is loaded`);
        console.log(`=> Getting News from : ${weatherRes.City.country} `);
        getNews(weatherRes.City.country).then(newsRes => {
          console.log(`=> Top News of ${weatherRes.City.country} is loaded`);
          console.log(`=> Preparing Final OutPut`);
          let counter = 1;
          let i = setInterval(() => {
            console.log(`Preparing In ${counter} sec`);
            counter++;
            if (counter > 5) {
              showData({
                weather: weatherRes,
                region: weatherRes.City,
                news: newsRes
              });
              return clearInterval(i);
            }
          }, 100);
        });
      });
    })
    .catch(err => {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    });
};

const showData = data => {
  clear();
  const { weather, region, news } = data;
  console.log(
    chalk.greenBright(
      figlet.textSync(region.city, { horizontalLayout: "full" })
    )
  );
  console.log(chalk.whiteBright("--------------------------------------"));
  console.log(chalk.bgBlue(`\n Region Details of ${region.city}`));
  console.log(
    chalk.blue(`\t Continent: ${chalk.blueBright(region.continent)}`)
  );
  console.log(chalk.blue(`\t Country: ${chalk.blueBright(region.country)}`));
  console.log(chalk.blue(`\t Provence: ${chalk.blueBright(region.provence)}`));
  console.log(chalk.blue(`\t City: ${chalk.blueBright(region.city)}`));
  console.log(chalk.whiteBright("--------------------------------------"));
  console.log(chalk.bgGreen(`\n Weather Details of ${region.city}`));
  console.log(
    chalk.green(`\t Forecast: ${chalk.greenBright(weather.forcast)}`)
  );
  console.log(
    chalk.green(
      `\t Day/Night: ${chalk.greenBright(weather.isDay ? "Day" : "Night")}`
    )
  );
  console.log(
    chalk.green(
      `\t Temperature in Fahrenheit: ${chalk.greenBright(
        weather.temperature.f
      )}`
    )
  );
  console.log(
    chalk.green(
      `\t Temperature in Celsius: ${chalk.greenBright(weather.temperature.c)}`
    )
  );
  console.log(chalk.whiteBright("--------------------------------------"));
  console.log(chalk.bgYellow(`\n Top News of ${region.country}`));
  news.forEach((element, i) => {
    console.log(chalk.yellowBright(`----------${i + 1}---------`));
    console.log(
      chalk.yellow(`\t Title : ${chalk.yellowBright(element.title)}`)
    );
    console.log(
      chalk.yellow(`\t Author : ${chalk.yellowBright(element.author)}`)
    );
    console.log(
      chalk.yellow(
        `\t Description : ${chalk.yellowBright(element.description)}`
      )
    );
    console.log(
      chalk.yellow(`\t Source : ${chalk.yellowBright(element.source.name)}`)
    );
    console.log(chalk.yellow(`\t Date : ${chalk.yellowBright(element.date)}`));
    console.log(
      chalk.yellow(`\t Read Complete at : ${chalk.yellowBright(element.url)}`)
    );
  });
};

module.exports = {
  getDetails
};
