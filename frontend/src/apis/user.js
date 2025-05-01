import api from "./axios"

export const apiRegister = (data) => {
    return api.post('api/v1/users/register', data);
}

export const apiLogin = (data) => {
    return api.post('api/v1/users/login', data);
}

export const apiRefresh = (data) => {
    return api.post('api/v1/users/refreshtoken', {
        withCredentials: true, // để gửi cookie
}); 
}



