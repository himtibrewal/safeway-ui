import axios from 'axios';
import API_URL from './url';

class AuthService {
    async login(username, password) {
        const response = await axios.post(API_URL() + '/auth/login', { username, password });
        if (response.data.response_data.access_token) {
            localStorage.setItem("user", JSON.stringify(response.data.response_data));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem("user");
    }

}

export default new AuthService();
