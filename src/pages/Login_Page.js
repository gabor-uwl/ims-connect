import { useContext, useState } from "react";
import { EmployeeContext } from "../components/Employee";
import InputBox from "../components/input_fields/InputBox";
import axios from "axios";





export default function LoginPage() {
  const [email, setEmail] = useState("jenny@innoman.com");
  const [password, setPassword] = useState("12345");
  const employeeContext = useContext(EmployeeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("LoginPage -> logging in with:", email, password);

    try {
      const res = await axios.post("http://localhost:3100/api/login", {email, password});

      employeeContext.logIn(res.data.employee);
    }
    catch(err) {
      console.error(err);

      if(err.response === undefined)
        alert(err.message);
      else
        alert(err.response.data.message);
    }
  };

  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
          <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>Innovation Management System</h1>
          <form onSubmit={handleLogin}>
            <InputBox labelText="Email:" inputType="email" inputValue={email} onChangeAction={setEmail} />
            <InputBox labelText="Password:" inputType="password" inputValue={password} onChangeAction={setPassword} />
            <div className="d-flex justify-content-center pt-5">
              <button className="btn w-100" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};