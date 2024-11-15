import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import { useUser } from './configs/UserContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Employees from './components/Employees';
import EmployeeDetails from './components/EmployeeDetails';
import EmployeeEdit from './components/EmployeeEdit';
import EmployeeDelete from './components/EmployeeDelete';
import EmployeeAdd from './components/EmployeeAdd';
import Statistics from './components/Statistics';
import CheckAttendance from './components/CheckAttendance';
import Attendance from './components/Attendance';
import AttendanceAdd from './components/AttendanceAdd';
import AttendanceDetails from './components/AttendanceDetails';
import AttendanceEdit from './components/AttendanceEdit';
import AttendanceDelete from './components/AttendanceDelete';

function App() {
  const { user } = useUser();

  return (
    <Router>
      <Layout />
      <Routes>
        {user ? <>
          <Route path='/' element={<Home />} />
          <Route path='/employees' element={<Employees />} />
          <Route path='/employees/:id' element={<EmployeeDetails />} />
          <Route path='/employees/:id/edit' element={<EmployeeEdit />} />
          <Route path='/employees/:id/delete' element={<EmployeeDelete />} />
          <Route path='/employees/add' element={<EmployeeAdd />} />
          <Route path='/attendance' element={<Attendance />} />
          <Route path='/attendance/add' element={<AttendanceAdd />} />
          <Route path='/attendance/:id' element={<AttendanceDetails/>} />
          <Route path='/attendance/:id/edit' element={<AttendanceEdit/>} />
          <Route path='/attendance/:id/delete' element={<AttendanceDelete/>} />
          <Route path='/attendance/check' element={<CheckAttendance />} />
          <Route path='/statistics' element={<Statistics />} />
        </> : <>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </>}
      </Routes>
    </Router>
  );
}

export default App;
