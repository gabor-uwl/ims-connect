import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeContext } from "../components/Employee";
import IdeaFormComponent from "../components/ui/IdeaForm";
import axios from "axios";




export default function EditIdeaPage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [idea, setIdea] = useState(null);
  const navigate = useNavigate();

  let params = useParams();
  const ideaId = params.ideaId;

  useEffect( () => {
    const fetchIdea = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/myidea", {ideaId, employeeId});

        setIdea(res.data.idea);
      }
      catch(err) {
        navigate("/myideas");
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    if (ideaId !== "new-idea")
      fetchIdea();
  }, [ideaId, employeeId, navigate]);

  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
          <h1 className="text-center m-4" 
              style={{fontFamily: "cursive"}}>{(ideaId !== "new-idea") ? ideaId : "New Idea"}</h1>
          <IdeaFormComponent idea={idea} />
        </div>
      </div>
    </div>
  );
};