import axios from "axios";

export const endpoints = {
    'login': '/o/token/',
    'current-user': '/employees/current-user/',
    'employees': '/employees/',
    'employee': (employeeId) => `/employees/${employeeId}/`,
    'departments': '/departments/',
    'attendance': '/attendance/',
    'attendance-a': (attendanceId) => `/attendance/${attendanceId}/`,
    'stats': '/stats/',
    'attendances-stats': '/attendance/stats/',
    'employees-name': '/employees-name/'
}

export const authAPI = (accessToken) =>
    axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        timeout: 5000,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

export default axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000,
});