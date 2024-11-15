import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { endpoints } from '../configs/API';

const Register = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const updateUser = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.rePassword) {
            setError("Password doesn't match");
            return;
        } else if (user.password.length < 6) {
            setError("Your password must be at least 6 characters");
            return;
        }

        try {
            let res = await API.post(endpoints.employees, user,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            if (res.status === 201) navigate('/');
        } catch (ex) {
            console.info(ex);
            setError(ex.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(e) => updateUser('username', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) => updateUser('email', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) => updateUser('password', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="re-password">Confirm Password:</label>
                    <input
                        type="password"
                        id="re-password"
                        value={user.rePassword}
                        onChange={(e) => updateUser('rePassword', e.target.value)}
                        required
                    />
                </div>

                <div style={{
                    color: 'red',
                    width: '100%',
                    textAlign: 'center'
                }}>{error}</div>
                <button type="submit">Register</button>

                <div className='new-to-us'>
                    Already have account? <Link to='/'>Log in</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;
