import axios from 'axios';
import authHeader from "./auth-header";
import API_URL from './url';

class UserService {

    getPublicContnat() {
        return axios.get(API_URL + "all");
    }

    // ADMIN COUNTRY 

    getCountries(paginated, page_number) {
        return axios.get(API_URL() + '/admin/country', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page_number
            },

        });
    }

    deleteCountry(id) {
        return axios.delete(API_URL() + '/admin/country/' + id, {
            headers: authHeader()
        });
    }

    getCountry(id) {
        return axios.get(API_URL() + '/admin/country/' + id, {
            headers: authHeader()
        });
    }

    addCountry(data) {
        return axios.post(API_URL() + '/admin/country', data, {
            headers: authHeader()
        });
    }

    editCountry(id, data) {
        return axios.put(API_URL() + '/admin/country/' + id, data, {
            headers: authHeader()
        });
    }

    // ADMIN STATE 

    getStates(paginated, page, country_id) {
        return axios.get(API_URL() + '/admin/country/' + country_id + '/state', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page,
            },
        });
    }

    deleteState(id) {
        return axios.delete(API_URL() + '/admin/state/' + id, {
            headers: authHeader()
        });
    }

    getState(id) {
        return axios.get(API_URL() + '/admin/state/' + id, {
            headers: authHeader()
        });
    }

    addState(country_id, data) {
        return axios.post(API_URL() + '/admin/country/' + country_id + '/state', data, {
            headers: authHeader()
        });
    }

    editState(country_id, id, data) {
        return axios.put(API_URL() + '/admin/country/' + country_id + '/state/' + id, data, {
            headers: authHeader()
        });
    }

    // ADMIN District 

    getDistricts(paginated, page, state_id) {
        return axios.get(API_URL() + '/admin/state/' + state_id + '/district', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page,
            },
        });
    }

    deleteDistrict(id) {
        return axios.delete(API_URL() + '/admin/district/' + id, {
            headers: authHeader()
        });
    }

    getDistrict(id) {
        return axios.get(API_URL() + '/admin/district/' + id, {
            headers: authHeader()
        });
    }

    addDistrict(state_id, data) {
        return axios.post(API_URL() + '/admin/state/' + state_id + '/district', data, {
            headers: authHeader()
        });
    }

    editDistrict(state_id, id, data) {
        return axios.put(API_URL() + '/admin/state/' + state_id + '/district/' + id, data, {
            headers: authHeader()
        });
    }

    // ADMIN USER 
    getusers(paginated, page) {
        return axios.get(API_URL() + '/users', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page,
            },
        });
    }

    getUser(id) {
        return axios.get(API_URL() + '/user/' + id, {
            headers: authHeader()
        });
    }

    getUserByKey(user) {
        return axios.get(API_URL() + '/user/search', {
            headers: authHeader(),
            params: {
                id: user.user_id,
                username: user.user_name,
                phone: user.phone,
                email: user.email
            }
        });
    }

    assignVehicle(id, data) {
        console.log(id);
        console.log(data);
        return axios.put(API_URL() + '/user/' + id + '/vehicle', data, {
            headers: authHeader()
        });
    }

    addUser(data) {
        return axios.post(API_URL() + '/user', data, {
            headers: authHeader()
        });
    }

    editUser(id, data) {
        return axios.put(API_URL() + '/user/' + id, data, {
            headers: authHeader()
        });
    }

    deleteUser(id) {
        return axios.delete(API_URL() + '/user/' + id, {
            headers: authHeader()
        });
    }

    //ADMIN VEHICLE

    getVehicles(paginated, page) {
        return axios.get(API_URL() + '/vehicle', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page,
            },
        });
    }

    getVehicleByKey(vehicle) {
        return axios.get(API_URL() + '/vehicle/search', {
            headers: authHeader(),
            params: {
                id: vehicle.vehicle_id,
                username: vehicle.reg_id,
            }
        });
    }

    deleteVehicle(id) {
        return axios.delete(API_URL() + '/vehicle/' + id, {
            headers: authHeader()
        });
    }

    getVehicle(id) {
        return axios.get(API_URL() + '/vehicle/' + id, {
            headers: authHeader()
        });
    }

    addVehicle(data) {
        return axios.post(API_URL() + '/vehicle', data, {
            headers: authHeader()
        });
    }

    editVehicle(id, data) {
        return axios.put(API_URL() + '/vehicle/' + id, data, {
            headers: authHeader()
        });
    }





    // ADMIN PERMISSION 

    getPermisisons(paginated, page) {
        return axios.get(API_URL() + '/admin/permission', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page,
            },
        });
    }

    getPermisison(id) {
        return axios.get(API_URL() + '/admin/permission/' + id, {
            headers: authHeader()
        });
    }

    addPermisisons(data) {
        return axios.post(API_URL() + '/admin/permission', data, {
            headers: authHeader()
        });
    }

    editPermisison(id, data) {
        return axios.put(API_URL() + '/admin/permission/' + id, data, {
            headers: authHeader()
        });
    }

    deletePermisison(id) {
        return axios.delete(API_URL() + '/admin/permission/' + id, {
            headers: authHeader()
        });
    }

    // ADMIN ROLE 

    getRoles(paginated, page) {
        return axios.get(API_URL() + '/admin/role', {
            headers: authHeader(),
            params: {
                paginated: paginated,
                page: page,
            },
        });
    }

    getRole(id) {
        return axios.get(API_URL() + '/admin/role/' + id, {
            headers: authHeader()
        });
    }

    addRole(data) {
        return axios.post(API_URL() + '/admin/role', data, {
            headers: authHeader()
        });
    }

    editRole(id, data) {
        return axios.put(API_URL() + '/admin/role/' + id, data, {
            headers: authHeader()
        });
    }

    deleteRole(id) {
        return axios.delete(API_URL() + '/admin/role/' + id, {
            headers: authHeader()
        });
    }

}

export default new UserService();
