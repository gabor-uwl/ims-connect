import { useContext } from "react";
import { EmployeeContext } from "./Employee"; 
import { NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import innoImg from "../assets/images/innovation.jpg";




export default function  HeaderComponent() {
  const employeeLoggedIn = useContext(EmployeeContext).loggedIn;
  const employeeName = useContext(EmployeeContext).employeeName;
  const isAdmin = useContext(EmployeeContext).isAdmin;

  return (
    <header className="position-fixed top-0 start-0 w-100">
      <nav className="navbar nav-underline navbar-expand navbar-light rounded" 
           style={{height:"60px"}}>
        <div className="col-9 navbar-nav text-light">
          <div className="justify-content-center mx-3" >
            <img src={innoImg} alt="IMS-Connect" style={{width:"48px", height:"48px"}} />
          </div>
          <NavItem name="Board" disabled={ !employeeLoggedIn } />
          <NavItem name="Projects" disabled={ !employeeLoggedIn } path="/projects" />
          <NavItem name="My Ideas" disabled={ !employeeLoggedIn } path="/myideas" />
          <NavItem name="My Rewards" disabled={ !employeeLoggedIn } path="/myrewards" />
        </div>
        {employeeLoggedIn && <div className="col-3 navbar-nav justify-content-center">
          {isAdmin && <NavItem name="Employees" path="/employees" />}
          <Tooltip anchorSelect=".my_profile">My Profile</Tooltip>
          <NavItem name={employeeName} path="/profile" tipAnchor="my_profile" />
          <span className="nav-link">|</span>
          <NavItem name="Log Out" path="/logout" />
        </div>}
      </nav>
    </header>
  );
};
  
function NavItem({name, path="/", disabled=false, tipAnchor=""}) {
  return (
    <NavLink
      to={path} 
      className={({isActive}) => [
        "nav-item nav-link rounded text-center m-1", 
        ((isActive && !disabled) ? "active" : ""), 
        (disabled ? "disabled text-white-50" : "link-light"), 
        tipAnchor].join(" ")}
      style={{width:"120px"}}>
      {name}
    </NavLink>
  );
};