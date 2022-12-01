import axios from 'axios'

const enviroments = {
    development: {
        serverUrl: 'http://localhost:5000'
    },
    production: {
        serverUrl: 'https://aqueous-escarpment-64453.herokuapp.com'
    }
}

export const config = enviroments[process.env.REACT_APP_ENV]

export const authorizedAxios = axios.create({
    baseURL: config.serverUrl
});

authorizedAxios.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('userData')!)?.accessToken;

export const unauthorizedAxios = axios.create({
    baseURL: config.serverUrl
});

authorizedAxios.interceptors.response.use(function (response) {
   
    return response;
  }, function (error) {
    console.log(error)
    if(error.response.status === 403){
        localStorage.removeItem('userData')
        window.location.href = '/auth/login'
    }
    return Promise.reject(error);
  });