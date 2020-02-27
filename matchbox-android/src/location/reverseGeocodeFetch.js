const apiKey = 'syqtooSVaT0W_nBbLZtdIzH67MocVfqOjhEoT78GGDU';

function reverseGeocodeFetch(latitude, longitude) {

  return fetch(`https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${latitude}%2C${longitude}%2C250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${apiKey}`, {
    method:"GET"
  }).then(r => r.json());
}
export default reverseGeocodeFetch;

