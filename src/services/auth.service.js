import axios from 'axios';
import API_URL from './url';
import authHeader from "./auth-header";

class AuthService {
    async login(username, password, type) {
        const response = await axios.post(API_URL() + '/auth/login', { username, password, type });
        if (response.data.response_data.access_token) {
            localStorage.setItem("user", JSON.stringify(response.data.response_data));
        }
        return response.data;
    }


    logout() {
        return axios.get(API_URL() + '/auth/logout', {
            headers: authHeader(),
        }); 
    }

}

export default new AuthService();
