import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../configs/UserContext";

const Home = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    if (!user) navigate('/login');

    return (
        <div style={{
            padding: '20px',
            textAlign: 'center'
        }}>
            <h1>Welcome to Resource Manangement home page!</h1>
            {user.avatar && <img src={user.avatar} alt="avatar" style={{
                borderRadius: '50%'
            }} height={150} width={150} />}
            <p>Xin chào, {user?.first_name} {user?.last_name}! Hope you have a wonderful day.</p>
            <div>
                <Link to='/attendance/check'>Check Attendance</Link>
            </div>
            <button style={{
                marginTop: '50px',
                width: 'auto',
                padding: '12px 20px'
            }} onClick={logout}>Log out</button>
        </div>
    )
}

export default Home;