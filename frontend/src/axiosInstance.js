import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, '');


export const WorkoutBaseUrl = axios.create({
    baseURL: `${baseURL}/workout`
})

export const userBaseUrl = axios.create({
    baseURL: `${baseURL}/user`
})

// setting headers
WorkoutBaseUrl.interceptors.request.use((config) => {
    const authToken = localStorage.getItem("userAuth")
    const token = JSON.parse(authToken)?.token

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
},
    (error) => {
        console.log("auth-req error", error)
        return Promise.reject(error)
    })

WorkoutBaseUrl.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("userAuth")
        window.location.href = "/login"
    }
    return Promise.reject(error)
})