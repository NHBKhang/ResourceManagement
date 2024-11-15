import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const AttendanceEdit = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState({});
    const { getAccessToken, user } = useUser();
    const { id } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAttendance({ ...attendance, [name]: value });
    };

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints['attendance-a'](id));
                setAttendance(res.data);
            } catch (ex) {
                console.info(ex);
                alert(ex.message);
            }
        }

        loadAttendance();
    }, [getAccessToken, id])

    const submit = async (e) => {
        e.preventDefault();
        try {
            let res = await authAPI(await getAccessToken()).patch((endpoints['attendance-a'](id)),
                { ...attendance, employee: user.id });
            if (res.status === 200) navigate(`/attendance/${id}`);
        } catch (ex) {
            console.error(ex);
        }
    };

    return (
        <>
            <div className="edit-employee">
                <h2>Edit Attendance</h2>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="employee">Employee:</label>
                        <input
                            type="text"
                            id="employee"
                            value={`${user.first_name} ${user.last_name}`}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={attendance.date}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hour">Hour:</label>
                        <input
                            type="number"
                            id="hour"
                            name="hour"
                            value={attendance.hour}
                            onChange={handleChange}
                            min={0.1}
                            step={0.1}
                            max={24}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={attendance.role}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={attendance.description}
                            onChange={handleChange}
                            required
                            style={{
                                width: 'calc(100% - 16px)',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '25px'
                    }}>
                        <button type="submit">Save Changes</button>
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

export default AttendanceEdit;
