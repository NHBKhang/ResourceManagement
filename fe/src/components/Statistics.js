import React, { useState, useEffect } from 'react';
import { useUser } from '../configs/UserContext';
import { authAPI, endpoints } from '../configs/API';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [query, setQuery] = useState('');
    const [summary, setSummary] = useState({});
    const { getAccessToken } = useUser();

    useEffect(() => {
        const loadData = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints['attendances-stats']);
                setAttendanceRecords(res.data);

                let stat = await authAPI(await getAccessToken()).get(endpoints.stats);
                setSummary(stat.data);
            } catch (ex) {
                alert(ex.message);
                console.info(ex);
            }
        }

        loadData();
    }, [getAccessToken]);

    const chartData = {
        labels: ['Approved', 'Disapproved', 'Not Yet Approved'],
        datasets: [
            {
                label: 'Attendance Status',
                data: [summary.approved, summary.disapproved, summary.not_yet_approved],
                backgroundColor: [
                    'rgba(82, 255, 47, 0.6)',
                    'rgba(255, 75, 100, 0.6)',
                    'rgba(74, 74, 74, 0.6)'
                ],
                hoverBackgroundColor: [
                    'rgba(82, 255, 47, 0.8)',
                    'rgba(255, 75, 100, 0.8)',
                    'rgba(74, 74, 74, 0.8)'
                ]
            }
        ]
    };

    const calculateTotal = (data) => {
        return data.reduce((sum, value) => sum + value, 0);
    }
    const total = calculateTotal(chartData.datasets[0].data);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Attendance Report</h2>

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
                        setAttendanceRecords(res.data);

                        let stat = await authAPI(await getAccessToken())
                            .get(`${endpoints.stats}?date=${query}`);
                        setSummary(stat.data);
                    } catch (ex) {
                        console.info(ex);
                        alert(ex.message);
                    }
                }}>
                    Find
                </button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '50px',
                marginBottom: '20px',
            }}>
                <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                    <Pie
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            return `${tooltipItem.label}: ${tooltipItem.raw} Hours`;
                                        },
                                        footer: () => {
                                            return `Total: ${total} Hours`;
                                        }
                                    }
                                },
                                legend: {
                                    position: 'top',
                                },
                            }
                        }}
                    />
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <strong>Total Hours: {total}</strong>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '700px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Employee</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hour</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.length > 0 ? (
                                attendanceRecords.map((record, index) =>
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.employee_name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{record.date_vn}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{record.hour}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.role}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.status}</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Statistics;
