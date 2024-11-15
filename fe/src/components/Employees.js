import React, { useEffect, useState } from 'react';
import API, { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';
import { useNavigate } from 'react-router-dom';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [query, setQuery] = useState({
        text: '',
        dept: 0
    });
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const { getAccessToken } = useUser();
    const navigate = useNavigate();

    const updateQuery = (field, value) => {
        setQuery(prev => ({ ...prev, [field]: value }));
    }

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                let res = await API.get(endpoints.departments);
                setDepartments(res.data);
            } catch (ex) {
                console.error(ex);
            }
        };

        loadDepartments();
    }, []);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints.employees);
                setEmployees(res.data);
            } catch (ex) {
                console.info(ex);
                if (ex.response?.data?.detail) 
                    setError(ex.response.data.detail)
                else
                    alert(ex.message);
            }
        }

        loadEmployees();
    }, [getAccessToken]);

    const viewDetails = (id) => {
        navigate(`/employees/${id}`);
    }

    const editEmployee = (id) => {
        navigate(`/employees/${id}/edit`);
    }

    const deleteEmployee = (id) => {
        navigate(`/employees/${id}/delete`);
    }

    if (error) return <div className='error'>{error}</div>

    return (
        <div className="employee-table-container">
            <h2>Employees Management</h2>
            <div className='form-group' style={{
                display: 'flex',
                gap: '15px'
            }}>
                <input
                    type="text"
                    id="text_query"
                    value={query.text}
                    onChange={(e) => updateQuery('text', e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    placeholder='Enter keyword...'
                    style={{
                        padding: '10px 15px',
                        width: 'calc(100% - 30px)'
                    }}
                />
                <select
                    className='form-select'
                    id="department"
                    name="department"
                    value={query.dept}
                    onChange={(e) => updateQuery('dept', e.target.value)}
                    style={{
                        width: 'auto',
                        height: '40px'
                    }}
                >
                    <option key={0} value="" selected>Select Department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </select>
                <button style={{
                    width: 'auto',
                    margin: 0,
                    fontSize: '0.95rem'
                }} onClick={async () => {
                    try {
                        let res = await authAPI(await getAccessToken())
                            .get(`${endpoints.employees}?q=${query.text}&dept=${query.dept}`);
                        setEmployees(res.data);
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
                        <th style={{ width: '5%' }}>ID</th>
                        <th style={{ width: '20%' }}>Full name</th>
                        <th style={{ width: '15%' }}>Position</th>
                        <th style={{ width: '15%' }}>Department</th>
                        <th style={{ width: '25%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{`${employee.first_name} ${employee.last_name}`}</td>
                            <td>{employee.position}</td>
                            <td>{employee.department_name}</td>
                            <td>
                                <button onClick={() => viewDetails(employee.id)} className="btn btn-view">View</button>
                                <button onClick={() => editEmployee(employee.id)} className="btn btn-edit">Edit</button>
                                <button onClick={() => deleteEmployee(employee.id)} className="btn btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button style={{
                width: 'auto',
                justifySelf: 'flex-end'
            }} onClick={() => navigate('/employees/add')}>Add New Employee</button>
        </div>
    );
}

export default Employees;
