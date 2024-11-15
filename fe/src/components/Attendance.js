import React, { useEffect, useState } from 'react';
import { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [query, setQuery] = useState('');
    const { getAccessToken } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints.attendance);
                setAttendance(res.data);
            } catch (ex) {
                console.info(ex);
                alert(ex.message);
            }
        }

        loadAttendance();
    }, [getAccessToken]);

    const viewDetails = (id) => {
        navigate(`/attendance/${id}`);
    }

    const editEmployee = (id) => {
        navigate(`/attendance/${id}/edit`);
    }

    const deleteEmployee = (id) => {
        navigate(`/attendance/${id}/delete`);
    }

    return (
        <div className="employee-table-container">
            <h2>Attendance Management</h2>

            <div className='form-group' style={{
                width: 'auto',
                display: 'flex',
                gap: '15px'
            }}>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    style={{
                        width: 'auto',
                        padding: '10px'
                    }}
                />
                <button style={{
                    width: 'auto',
                    margin: 0,
                    fontSize: '0.95rem'
                }} onClick={async () => {
                    try {
                        let res = await authAPI(await getAccessToken())
                            .get(`${endpoints.attendance}?date=${query}`);
                        setAttendance(res.data);
                    } catch (ex) {
                        console.info(ex);
                        alert(ex.message);
                    }
                }}>
                    Find
                </button>
            </div>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Full name</th>
                        <th style={{ width: '10%' }}>Date</th>
                        <th style={{ width: '0%' }}>Hour</th>
                        <th style={{ width: '15%' }}>Role</th>
                        <th style={{ width: '20%' }}>Description</th>
                        <th style={{ width: '35%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((a) => (
                        <tr key={a.id}>
                            <td>{a.employee_name}</td>
                            <td style={{
                                textAlign: 'center'
                            }}>{a.date_vn}</td>
                            <td style={{
                                textAlign: 'center'
                            }}>{a.hour}</td>
                            <td>{a.role}</td>
                            <td>{a.description}</td>
                            <td>
                                <button onClick={() => viewDetails(a.id)} className="btn btn-view">View</button>
                                <button onClick={() => editEmployee(a.id)} className="btn btn-edit">Edit</button>
                                <button onClick={() => deleteEmployee(a.id)} className="btn btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button style={{
                width: 'auto',
                justifySelf: 'flex-end'
            }} onClick={() => navigate('/attendance/add')}>Add New Attendance</button>
        </div>
    );
}

export default Attendance;
