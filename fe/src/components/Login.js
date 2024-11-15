import React, { useState } from 'react';
import { useUser } from '../configs/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let user = await login(username, password);
            if (user) navigate('/');
        } catch (ex) {
            console.error(ex);
            setError(ex.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div style={{
                    color: 'red',
                    width: '100%',
                    textAlign : 'center'
                }}>{error}</div>
                <button type="submit">Login</button>

                <div className='new-to-us'>
                    New to us? <Link to='/register'>Sign up</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
