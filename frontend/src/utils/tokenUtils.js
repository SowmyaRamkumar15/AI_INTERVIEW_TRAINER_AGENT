export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const removeRefreshToken = () => localStorage.removeItem('refreshToken');

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        localStorage.removeItem('user'); // clear corrupted entry
        return null;
    }
};
export const removeUser = () => localStorage.removeItem('user');

export const clearAuth = () => {
    removeToken();
    removeRefreshToken();
    removeUser();
};
