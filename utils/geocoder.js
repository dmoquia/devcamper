const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODE_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null, // 'gpx', 'string', ...
  // fetch: customFetchImplementation,
  // Optional depending on the providers
  // apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
