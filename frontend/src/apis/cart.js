import api from "./axios"

export const apiAddItem = (data) => {
    return api.post('api/v1/cart/', data);
}

export const apiUpdateItem = (data) => {
    return api.patch('api/v1/cart/', data);
}

export const apiGetItem = () => {
    return api.get('api/v1/cart/');
}
