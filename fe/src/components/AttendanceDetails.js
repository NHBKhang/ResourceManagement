import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const AttendanceDetails = () => {
    const [attendance, setAttendance] = useState(null);
    const { id } = useParams();
    const { getAccessToken } = useUser();

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints['attendance-a'](id));
                setAttendance(res.data);
            } catch (ex) {
                console.info(ex);
            }
        }

        loadAttendance();
    }, [id, getAccessToken]);

    if (!attendance)
        return <div className="error">No attendance found.</div>;

    return (
        <>
            <div style={{
                margin: '20px 0 10px 50px'
            }}>
                <a href="/attendance">Go Back</a>
            </div>
            <div className="employee-details">
                <h2>Attendance details</h2>
                <p><strong>ID:</strong> {attendance.id}</p>
                <p><strong>Full name:</strong> {attendance.employee_name}</p>
                <p><strong>Date:</strong> {attendance.date_vn}</p>
                <p><strong>Hour:</strong> {attendance.hour}</p>
                <p><strong>Role:</strong> {attendance.role}</p>
                <p><strong>Description:</strong> {attendance.description}</p>
            </div>
        </>
    );
}

export default AttendanceDetails;
