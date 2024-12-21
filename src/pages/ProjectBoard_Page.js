import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeContext } from "../components/Employee";
import ColumnComponent from "../components/ui/Column";
import axios from "axios";




export default function ProjectBoardPage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [tasks, setTasks] = useState();
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const navigate = useNavigate();

  let params = useParams();
  const projectId = params.projectId;

  useEffect( () => {
    const fetchTasks = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/project", {projectId});

        setTasks(res.data.tasks);
        setIsTeamLeader(employeeId === res.data.teamLeaderId);
      }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    fetchTasks();
  }, [projectId, employeeId]);

  if (tasks === undefined)
    return null;

  return (
    <div className="flex: 1 container align-items-center justify-content-center">
      <div className="row">
        <div className="col text-start mt-3 mb-0">
          <h3 style={{fontFamily: "cursive"}}>{projectId}</h3>
        </div>
        <div className="col-2 mt-4">
          {isTeamLeader && <button className="btn w-100 mx-3" 
                                   type="button" 
                                   onClick={() => navigate("/projects/" + projectId + "/newtask")}
                           >Create Task</button>}
        </div>
      </div>
      <div className="row">
        <ColumnComponent title="To Do" tasks={tasks} type="todo"/>
        <ColumnComponent title="In Progress" tasks={tasks} type="inprogress"/>
        <ColumnComponent title="Done" tasks={tasks} type="done"/>
      </div>
    </div>
  );
};