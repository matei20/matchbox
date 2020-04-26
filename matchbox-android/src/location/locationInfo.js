import reverseGeocodeFetch from './reverseGeocodeFetch';

const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

async function success(position, resolve) {

    const latitude = JSON.stringify(position.coords.latitude);
    const longitude = JSON.stringify(position.coords.longitude);
    const geocodeResponse = await reverseGeocodeFetch(latitude, longitude);
    if (geocodeResponse) {
        const info = geocodeResponse.Response.View[0].Result[0].Location;
        obj = new Object();
        obj.country = info.Address.AdditionalData[0].value;
        obj.city = info.Address.County;
        obj.latitude = latitude;
        obj.longitude = longitude;
        return resolve(obj);
    }
    resolve(null);
}

function error(err, resolve) {
    console.log("======locationInfo err======");//debugging
    console.log(err);
    resolve(null);
}

function locationInfo() {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition((position) => success(position, resolve), (err) => error(err,resolve), options);
    });
};

export default locationInfo;