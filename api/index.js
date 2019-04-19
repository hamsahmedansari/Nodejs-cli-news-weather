const IP_GEOLOCATION_KEY = "49a818d7a92145748f558b2dacb621fb";
const ACCUWEATHER_KEY = "v5c7Bs4r77uDiBWfT6vUZC0FvuegWapW"; //limits
const NEWS_KEY = "1586aa5799b7438a92e9e269afd96e13";
module.exports = {
  ipGeolocation:
    "https://api.ipgeolocation.io/ipgeo?apiKey=" + IP_GEOLOCATION_KEY,
  cities:
    "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" +
    ACCUWEATHER_KEY,
  weather: `http://dataservice.accuweather.com/currentconditions/v1/`,
  ACCUWEATHER_KEY,
  newsApi: "https://newsapi.org/v2/top-headlines?q=",
  NEWS_KEY
};
