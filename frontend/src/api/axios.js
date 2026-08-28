import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token && token !== 'dummy') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            const refreshToken = localStorage.getItem('refresh');
            if (!refreshToken || refreshToken === 'dummy') {
                isRefreshing = false;
                if (refreshToken !== 'dummy') {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
                localStorage.setItem('access', data.access);
                if (data.refresh) {
                    localStorage.setItem('refresh', data.refresh);
                }
                api.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.access;
                processQueue(null, data.access);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
