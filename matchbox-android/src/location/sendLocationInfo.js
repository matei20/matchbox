import apiFetch from "../lib/apiFetch";
import reverseGeocodeFetch from './reverseGeocodeFetch';

const sendLocationInfo = () => {
    navigator.geolocation.getCurrentPosition(
        async position => {

            const latitude = JSON.stringify(position.coords.latitude);
            const longitude = JSON.stringify(position.coords.longitude);

            const geocodeResponse = await reverseGeocodeFetch(latitude, longitude);
            if (geocodeResponse) {
                const location = geocodeResponse.Response.View[0].Result[0].Location;
                const obj = new Object();
                obj.country = location.Address.AdditionalData[0].value;
                obj.city = location.Address.County;
                obj.latitude = latitude;
                obj.longitude = longitude;
                apiFetch('save-user-location', obj);
            }
        },
        error => {
            console.log("send-location-info");//debugging
            console.log(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
};

export default sendLocationInfo;