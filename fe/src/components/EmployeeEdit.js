import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const EmployeeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [tempEmployee, setTempEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const { getAccessToken } = useUser();

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints.employee(id));
                setEmployee(res.data);
            } catch (ex) {
                console.info(ex);
            }
        };

        const loadDepartments = async () => {
            try {
                let res = await API.get(endpoints.departments);
                setDepartments(res.data);
            } catch (ex) {
                console.error(ex);
            }
        };

        loadEmployee();
        loadDepartments();
    }, [id, getAccessToken]);

    if (!employee) {
        return <div className="error">No employee found.</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
        setTempEmployee({ ...tempEmployee, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            let form = new FormData();
            for (let key in tempEmployee) {
                form.append(key, tempEmployee[key]);
            }

            let res = await authAPI(await getAccessToken()).patch(endpoints.employee(id),
                form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (res.status === 200) navigate(`/employees/${id}`);
        } catch (ex) {
            console.error(ex);
        }
    };

    return (
        <>
            <div className="edit-employee">
                <h2>Edit Employee Details</h2>
                <form onSubmit={submit}>
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
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
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
                            navigate('/employees');
                        }}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmployeeEdit;
