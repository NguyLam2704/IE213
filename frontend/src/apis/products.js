import api from "./axios"

export const apiGetItem = async (productId) => {
    return api.get(`api/v1/products/${productId}`);
}

