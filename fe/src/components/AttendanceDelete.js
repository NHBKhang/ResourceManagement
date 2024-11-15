import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const AttendanceDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const { getAccessToken } = useUser();

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints['attendance-a'](id));
                setAttendance(res.data);
            } catch (ex) {
                console.error(ex);
            }
        };

        loadAttendance();
    }, [id, getAccessToken]);

    if (!attendance) {
        return <div className="error">No attendance found.</div>;
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            let res = await authAPI(await getAccessToken()).delete(endpoints['attendance-a'](id));
            if (res.status === 204) navigate('/attendance');
        } catch (ex) {
            console.error(ex);
        }
    };

    return (
        <>
            <div className="edit-employee">
                <h2>Are You Sure Want To Delete Attendance {attendance.date_vn} - {attendance.role}?</h2>
                <form onClick={submit}>
                    <div style={{
                        display: 'flex',
                        gap: '25px'
                    }}>
                        <button type="submit">Yes, I am</button>
                        <button type="button" style={{
                            backgroundColor: 'red'
                        }} onClick={(e) => {
                            e.stopPropagation();
                            navigate('/attendance');
                        }}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AttendanceDelete;
