import { Link } from "react-router-dom";

const Layout = () => (
    <>
        <header className="header">
            <nav className="nav">
                <div className="logo" style={{
                    cursor: 'pointer'
                }}>Resource Manager</div>
                <ul className="nav-links">
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/employees'>Employees</Link></li>
                    <li><a href="/attendance">Attendance</a></li>
                    <li><a href="/statistics">Statistics</a></li>
                </ul>
            </nav>
        </header>
    </>
);
export default Layout;