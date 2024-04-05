
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.access_token) {
        return {
            'Authorization': user.token_type + ' ' + user.access_token,
            'refresh_token': user.refresh_token,
            'Content-Type': 'application/json'
        };
    }

    return {}

}

export default authHeader