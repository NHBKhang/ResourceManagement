import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const EmployeeAdd = () => {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({});
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const { getAccessToken } = useUser();

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
    }, [getAccessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();

        if (employee.password.length < 6) {
            setError('Your password must be at least 6 characters');
            return;
        }

        try {
            let res = await authAPI(await getAccessToken()).post(endpoints.employees, employee);
            if (res.status === 201) navigate(`/employees`);
        } catch (ex) {
            console.error(ex);
        }
    };

    return (
        <>
            <div className="edit-employee">
                <h2>Add Employee</h2>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={employee.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={employee.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='w-100' style={{
                        gap: '4%',
                        display: 'flex'
                    }}>
                        <div className="form-group" style={{
                            width: '48%'
                        }}>
                            <label htmlFor="first-name">First Name:</label>
                            <input
                                type="text"
                                id="first-name"
                                name="first_name"
                                value={employee.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{
                            width: '48%'
                        }}>
                            <label htmlFor="last-name">Last Name:</label>
                            <input
                                type="text"
                                id="last-name"
                                name="last_name"
                                value={employee.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="position">Position:</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={employee.position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={employee.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone_number"
                            value={employee.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <select
                            className='form-select'
                            id="department"
                            name="department"
                            value={employee.department}
                            onChange={handleChange}
                            required
                        >
                            <option key={0} value="" disabled selected>Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{
                        color: 'red',
                        width: '100%',
                        textAlign: 'center'
                    }}>{error}</div>
                    <div style={{
                        display: 'flex',
                        gap: '25px'
                    }}>
                        <button type="submit">Add Employee</button>
                        <button type="button" style={{
                            backgroundColor: 'red'
                        }} onClick={(e) => {
                            e.stopPropagation();
                            navigate('/employees');
                        }}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmployeeAdd;
