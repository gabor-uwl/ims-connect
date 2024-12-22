import { useEffect, useState } from "react";
import ProjectComponent from "../components/ui/Project";
import LoadingComponent from "../components/ui/Loading";
import axios from "axios";





export default function ProjectsPage() {
  const [projects, setProjects] = useState();
  const [timeOut, setTimeOut] = useState(true);

  useEffect( () => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3100/api/projects");

        setProjects(res.data.projects);
      }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    fetchProjects();
  }, []);

  if ((projects === undefined) || timeOut)
    return (
      <LoadingComponent timeOutHandler={setTimeOut} 
                        message="Loading Projects page. Please wait."/>
    );

  if (projects === undefined)
    return null;

  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col m-3">
          <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>Projects</h1>
          <hr/>
          <ul className="list-unstyled">
            {projects.map((project) => <ProjectComponent  project={project}/>)}
          </ul>
        </div>
      </div>
    </div>
  );
};