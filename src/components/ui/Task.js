import { useNavigate, useParams } from "react-router-dom";




export default function TaskComponent({task}) {
  const navigate = useNavigate();

  let params = useParams();
  const projectId = params.projectId;

  const viewTask = () => {
    navigate("/projects/" + projectId + "/" + task.taskId);
  };

  return (
    <li>
      <div
        className="col rounded border border-dark m-3 task"
        style={{cursor:"pointer"}}
        onClick={viewTask}>
        <div className="text-start m-3">
          <h3>{task.title}</h3>
        </div>
        <div className="row m-3 d-flex align-items-center">
          <div className="col text-start">
            <h5>{task.firstName + " " + task.lastName}</h5>
          </div>
          <div className="col text-end">
            <h5>{task.taskId}</h5>
          </div>
        </div>
      </div>
    </li>
  );
};