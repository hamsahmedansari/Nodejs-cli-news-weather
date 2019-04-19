const request = require("request");
const api = require("../api");

const get = new Promise((resolve, reject) => {
  request(api.ipGeolocation, (err, res, body) => {
    if (err) reject(err);
    const newRes = JSON.parse(body);
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

module.exports = {
  getRegionDetails: get
};
