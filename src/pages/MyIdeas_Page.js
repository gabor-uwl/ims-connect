import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../components/Employee";
import { useNavigate } from "react-router-dom";
import MyIdeaComponent from "../components/ui/MyIdea";
import LoadingComponent from "../components/ui/Loading";
import axios from "axios";



export default function MyIdeasPage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [data, setData] = useState();
  const [timeOut, setTimeOut] = useState(true);
  const navigate = useNavigate();

  useEffect( () => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/myideas", {employeeId});

        setData(res.data);
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

  const handleCreate = () => {
    navigate("/myideas/new-idea");
  };

  if ((data === undefined) || timeOut)
    return (
      <LoadingComponent timeOutHandler={setTimeOut} 
                        message="Loading your Ideas page. Please wait."/>
    );

  return (
    <div className="flex: 1 container align-items-center justify-content-center">
      <div className="row m-3">
      <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>My Ideas</h1>
      <div className="col">
      <ul className="list-unstyled">
        {data.ideas.map((idea) => <MyIdeaComponent key={idea.id} idea={idea}/>)}
      </ul>
      </div>
      <div className="col-4 mt-3">
        <button className="btn create" onClick={handleCreate} 
                style={{minWidth:"120px"}}>Create Idea</button>
      </div>

      </div>
    </div>
  );
};