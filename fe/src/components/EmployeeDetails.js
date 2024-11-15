import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null);
    const { id } = useParams();
    const { getAccessToken } = useUser();

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints.employee(id));
                setEmployee(res.data);
            } catch (ex) {
                console.info(ex);
            }
        }

        loadEmployee();
    }, [id, getAccessToken]);

    if (!employee)
        return <div className="error">Không tìm thấy thông tin nhân viên.</div>;

    return (
        <>
            <div style={{
                margin: '20px 0 10px 50px'
            }}>
                <Link to="/employees">Go Back</Link>
            </div>
            <div className="employee-details">
                <h2>Employee details</h2>
                <p><strong>ID:</strong> {employee.id}</p>
                <p><strong>Full name:</strong> {`${employee.first_name} ${employee.last_name}`}</p>
                <p><strong>Position:</strong> {employee.position}</p>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Phone number:</strong> {employee.phone_number}</p>
                <p><strong>Department:</strong> {employee.department_name}</p>
                <p><strong>Description:</strong> {employee.details}</p>
            </div>
        </>
    );
}

export default EmployeeDetails;
