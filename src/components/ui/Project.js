import { useNavigate } from "react-router-dom";



export default function ProjectComponent({project}) {
  const navigate = useNavigate();

  const viewProject = () => {
    navigate("/projects/" + project.projectId);
  };

  return (
    <li>
      <div className="row text-start w-100 m-3">
        <div className="col-2 rounded border border-3 border-secondary text-center project pt-2" style={{cursor:"pointer"}} onClick={viewProject}>
          <h3>{project.projectId}</h3>
        </div>
        <div className="col-6 pt-2">
          <h3>{project.name}</h3>
        </div>
        <div className="col-4 pt-3">
          <h5>Team Leader: {project.teamLeader}</h5>
        </div>
      </div>
      <hr/>
    </li>
  );
};