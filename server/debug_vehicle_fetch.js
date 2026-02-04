
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';
const vehicleId = '691755519c55cf959d55da76';

const fetchVehicle = async () => {
    try {
        console.log(`Fetching vehicle: ${vehicleId}`);
        const res = await axios.get(`${API_URL}/vehicles/${vehicleId}`);
        console.log('Vehicle data:', JSON.stringify(res.data.data.vehicle, null, 2));
    } catch (err) {
        console.error('Error fetching vehicle:', err.response ? err.response.data : err.message);
    }
};

fetchVehicle();
