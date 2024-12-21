import { useContext, useEffect } from "react";
import { EmployeeContext } from "../components/Employee";
import { useNavigate } from "react-router-dom";


export default function LogoutPage() {
  const employeeContext = useContext(EmployeeContext);
  const navigate = useNavigate();

  useEffect( () => {
    setTimeout( () => {
      employeeContext.logOut();
      navigate("/");
    }, 2000);
  });

  return (
    <div>
      <h1 style={{fontFamily: "cursive", marginTop: "50px"}}>We are logging you out. Please wait.</h1>
      <div className="spinner-border text-dark" style={{width: "50px",height: "50px", marginTop: "50px"}}></div>
   </div>
  );
};