import axios from "axios";

const API_BASE_URL = 
    import.meta.env.Vite_API_BASE_URL ||
    "https://jarvisbackend-87tw.onrender.com/";

const api = axios.create(
    {
        baseURL: API_BASE_URL,
        headers:{
            "Content-Type":"application/json",
        }
    }
);

api.interceptors.request.use(
    (config)=>{
        if(config.data instanceof FormData){
            delete config.headers["Content-Type"];
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        console.error("API error:", error);
        return Promise.reject(error);
    }
);

const get = async(url, params = {}, headers = {}) => {
    try{
        const response = await api.get(
            url,
            {
                params,
                headers
            }
        );
        return response.data;
    }catch(error){
        throw error.response ? error.response.data : error;
    }
};

const post = async (url, data = {}, headers = {})=>{
    try{
        const response = await api.post(
            url,
            data,
            {
                headers
            }
        );
        return response.data;
    }
    catch(error){
        throw error.response ? error.response.data : error;
    }
}

const put = async(url, data = {}, headers={})=>{
    try {
        const response = await api.put(
            url,
            data,
            {
                headers
            }
        )
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

const patch = async(url, data = {}, headers={})=>{
    try {
        const response = await api.patch(
            url,
            data, 
            {
                headers
            }
        )
        return response.data;
    } catch (error) {
        throw error.response?
        error.response.data:error;
    }
}

const del = async (url, headers = {}) => {

    try {

        const response = await api.delete(
            url,
            {
                headers
            }
        );

        return response.data;

    } catch (error) {

        throw error.response
            ? error.response.data
            : error;
    }
};

export default {
    get,
    post,
    put,
    patch,
    delete: del,
};