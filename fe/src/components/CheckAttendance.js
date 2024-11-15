import React, { useState } from 'react';

const CheckAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const handleClockIn = () => {
        const record = {
            type: 'Clock In',
            time: new Date().toLocaleString(),
        };
        setAttendanceRecords([...attendanceRecords, record]);
    };

    const handleClockOut = () => {
        const record = {
            type: 'Clock Out',
            time: new Date().toLocaleString(),
        };
        setAttendanceRecords([...attendanceRecords, record]);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '25px auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Attendance</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button onClick={handleClockIn} style={{ padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer' }}>Clock In</button>
                <button onClick={handleClockOut} style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#dc3545', color: '#fff', cursor: 'pointer' }}>Clock Out</button>
            </div>
            <h3 style={{ color: '#555' }}>Attendance Records:</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {attendanceRecords.map((record, index) => (
                    <li key={index} style={{ backgroundColor: '#fff', padding: '10px', margin: '5px 0', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <strong>{record.type}</strong> at {record.time}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CheckAttendance;