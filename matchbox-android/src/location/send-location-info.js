import apiFetch from "../lib/apiFetch";
import reverseGeocodeFetch from '../location/reverseGeocodeFetch';


const sendLocationInfo = () => {
    navigator.geolocation.getCurrentPosition(
        async position => {
            const latitude = JSON.stringify(position.coords.latitude);
            const longitude = JSON.stringify(position.coords.longitude);

            var geocodeResponse = await reverseGeocodeFetch(latitude, longitude);
            if (geocodeResponse) {
                var location = geocodeResponse.Response.View[0].Result[0].Location;
                var obj = new Object();
                obj.country = location.Address.AdditionalData[0].value;
                obj.city = location.Address.City;
                obj.latitude = latitude;
                obj.longitude = longitude;
                apiFetch('save-user-location',obj);
                
            }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
};

export default sendLocationInfo;