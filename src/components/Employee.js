import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const EmployeeContext = createContext(null);

export default function EmployeeProvider({ children }) {
  const employee = JSON.parse(sessionStorage.getItem("employee"));
  const [employeeId, setEmployeeId] = useState(employee ? employee.id : null);
  const [employeeName, setEmployeeName] = useState(employee ? employee.firstName : null);
  const [loggedIn, setLoggedIn] = useState(employee ? true : false);
  const [isAdmin, setIsAdmin] = useState(employee ? (employee.jobTitle === "Admin" ? true : false) : false);
  const navigate = useNavigate();

//  console.log("EmployeeProvider -> name, status:", employeeName, loggedIn, isAdmin);

  const logIn = (user) => {
    sessionStorage.setItem("employee", JSON.stringify(user));
    setEmployeeId(user.id);
    setEmployeeName(user.firstName);
    setLoggedIn(true);
    setIsAdmin(user.jobTitle === "Admin" ? true : false)
    navigate("/");
  };

  const logOut = () => {
    sessionStorage.removeItem("employee");
    setEmployeeId(null);
    setEmployeeName(null);
    setLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <EmployeeContext.Provider value={{ employeeId, employeeName, loggedIn, isAdmin, logIn, logOut }}>
      {children}
    </EmployeeContext.Provider>
  );
};
