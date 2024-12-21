import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../components/Employee";
import InputBox from "../components/input_fields/InputBox";
import axios from "axios";




export default function ProfilePage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [qualification, setQualification] = useState("");
  const [department, setDepartment] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect( () => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/employee", {employeeId});

        setTitle(res.data.employee.title);
        setFirstName(res.data.employee.firstName);
        setLastName(res.data.employee.lastName);
        setEmail(res.data.employee.email);
        setJobTitle(res.data.employee.jobTitle);
        setQualification(res.data.employee.qualification);
        setDepartment(res.data.employee.departmentCode);
      }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    fetchIdeas();
  }, [employeeId]);

  const handleSave = async (e) => {
    e.preventDefault();

  };


  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row w-100 m-3">
        <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>My Profile</h1>
        <div className="col-2"></div>
        <div className="col-3">
          <form onSubmit={handleSave}>
            <InputBox labelText="Title:" 
                      inputType="text" 
                      inputValue={title} 
                      onChangeAction={setTitle} 
                      isReadOnly={isReadOnly} />
            <InputBox labelText="First Name:" 
                      inputType="text" 
                      inputValue={firstName} 
                      onChangeAction={setFirstName} 
                      isReadOnly={isReadOnly} />
            <InputBox labelText="Last Name:" 
                      inputType="text" 
                      inputValue={lastName} 
                      onChangeAction={setLastName} 
                      isReadOnly={isReadOnly} />
            <InputBox labelText="Qualification:" 
                      inputType="text" 
                      inputValue={qualification} 
                      onChangeAction={setQualification} 
                      isReadOnly={isReadOnly} />
            <div className="d-flex justify-content-center pt-5">
              <button className="btn w-100 mx-3" 
                      type="button" 
                      onClick={() => setIsReadOnly(!isReadOnly)}>
                {isReadOnly ? "Edit": "Cancel"}
              </button>
              <button className={"btn w-100 mx-5" + (isReadOnly ? " disabled" : "")} 
                      type="submit">Save</button>
            </div>
          </form>
        </div>
        <div className="col-2"></div>
        <div className="col-3">
          <form>
            <InputBox labelText="Email:" 
                      inputType="email" 
                      inputValue={email} 
                      onChangeAction={setEmail} 
                      isReadOnly={true} />
            <InputBox labelText="Job Title:" 
                      inputType="text" 
                      inputValue={jobTitle} 
                      onChangeAction={setJobTitle} 
                      isReadOnly={true} />
            <InputBox labelText="Department:" 
                      inputType="text" 
                      inputValue={department} 
                      onChangeAction={setDepartment} 
                      isReadOnly={true} />
          </form>
        </div>
        <div className="col-2">
        </div>
      </div>
    </div>
  );
};