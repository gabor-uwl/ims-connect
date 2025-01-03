import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeContext } from "../components/Employee";
import InputBox from "../components/input_fields/InputBox";
import TextBox from "../components/input_fields/TextBox";
import ComboBox from "../components/input_fields/ComboBox";
import axios from "axios";


export default function TaskPage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState({value: "todo", label: "To Do"});
  const [assigneeId, setAssigneeId] = useState();
  const [assignee, setAssignee] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [comment, setComment] = useState("");
  const [teamMemberOptions, setTeamMemberOptions] =useState();
  const navigate = useNavigate();

  const stateOptions = [{value: "todo", label: "To Do"},
                        {value: "inprogress", label: "In Progress"},
                        {value: "done", label: "Done"}];

  let params = useParams();
  const taskId = params.taskId;
  const projectId = params.projectId;

  useEffect( () => {
    const fetchTask = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/task", {taskId, projectId});

        setTitle(res.data.task.title);
        setDescription(res.data.task.description);
        for (let index = 0; index < stateOptions.length; index++) {
          if (stateOptions[index].value === res.data.task.state) {
            setState({value: res.data.task.state, label: stateOptions[index].label});
            break;
          }
        }
        setAssignee({value: res.data.task.assigneeId, label: res.data.task.assignee});
        setAssigneeId(res.data.task.assigneeId);
        setIsDisabled(res.data.task.assigneeId !== employeeId);
      }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/teammembers", {projectId});

        setTeamMemberOptions(res.data.teamMembers);
      }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    if (taskId === "newtask")
      fetchTeamMembers();
    else
      fetchTask();
  }, [employeeId, projectId, taskId]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (taskId === "newtask") {
        const res = await axios.post(
          "http://localhost:3100/api/task/create", {title, description, assigneeId, projectId});

        if (res.data.state === undefined)
          alert("Unexpected error to create task. Please try to create it again.")
      }
      else {
        const res = await axios.post(
          "http://localhost:3100/api/task/update", {taskId, projectId, state: state.value});

        if (res.data.state === undefined)
          alert("Unexpected error to update task. Please try to update it again.")
      }
    }
    catch(err) {
      console.error(err);

      if(err.response === undefined)
        alert(err.message);
      else
        alert(err.response.data.message);
    }

    navigate("/projects/" + projectId);
  };

  const handleAssigneeChange = (e) => {
    setAssignee(e);
    setAssigneeId(e.value);
  };

  const handleStateChange = (e) => {
    setState(e);
  };

  if ((taskId !== "newtask") && (assignee === undefined))
    return;

  return (
    <form onSubmit={handleSave}>
      <div className="flex: 1 container d-flex align-items-center justify-content-center">
        <div className="row w-100 m-3">
          <h1 className="text-start m-4" style={{fontFamily: "cursive"}}>
            {(taskId !== "newtask") ? taskId : "New Task"}
          </h1>
          <div className="col-2"></div>
          <div className="col-3">
            <InputBox labelText="Title:" 
                      inputType="text" 
                      inputValue={title} 
                      onChangeAction={setTitle} 
                      isDisabled={taskId !== "newtask"} />
            <TextBox labelText="Description:"
                     textValue={description}
                     isDisabled={taskId !== "newtask"}
                     onChangeAction={setDescription} />
            { (taskId !== "newtask") &&
            <TextBox labelText="Comment:"
                     inputValue={comment}
                     isRequired={false}
                     isDisabled={isDisabled}
                     onChangeAction={setComment} />}
          </div>
          <div className="col-2"></div>
          <div className="col-3">
            <ComboBox labelText="Assignee:" 
                      defaultOption={assignee}
                      onChangeAction={handleAssigneeChange}
                      valueOptions={teamMemberOptions}
                      isDisabled={taskId !== "newtask"} />
            <ComboBox labelText="State:" 
                      defaultOption={state}
                      onChangeAction={handleStateChange}
                      valueOptions={stateOptions}
                      isDisabled={isDisabled} />
            <div className="d-flex justify-content-center pt-5">
              <button className="btn w-100 mx-3" 
                      type="button" 
                      onClick={() => navigate("/projects/" + projectId)}
              >{isDisabled && (taskId !== "newtask") ? "Close": "Cancel"}</button>
              <button className={"btn w-100 mx-5" + (isDisabled && (taskId !== "newtask") ? " disabled" : "")} 
                      type="submit"
              >Save</button>
            </div>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </form>
  );
};