import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI, endpoints } from '../configs/API';
import { useUser } from '../configs/UserContext';

const EmployeeDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const { getAccessToken } = useUser();

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                let res = await authAPI(await getAccessToken()).get(endpoints.employee(id));
                setEmployee(res.data);
            } catch (ex) {
                console.error(ex);
            }
        };

        loadEmployee();
    }, [id, getAccessToken]);

    if (!employee) return <div className="error">No employee found.</div>;

    const submit = async (e) => {
        e.preventDefault();
        try {
            let res = await authAPI(await getAccessToken()).delete(endpoints.employee(id));
            if (res.status === 204) navigate('/employees');
        } catch (ex) {
            console.error(ex);
        }
    };

    return (
        <>
            <div className="edit-employee">
                <h2>Are You Sure Want To Delete Employee {employee.last_name}?</h2>
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

export default EmployeeDelete;
