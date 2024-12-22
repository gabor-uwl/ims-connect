import { useEffect, useState } from "react";
import ColumnComponent from "../components/ui/Column";
import LoadingComponent from "../components/ui/Loading";
import axios from "axios";





export default function IdeaBoardPage() {
  const [ideas, setIdeas] = useState();
  const [timeOut, setTimeOut] = useState(true);

  useEffect( () => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get("http://localhost:3100/api/ideaboard");

        setIdeas(res.data.ideas);
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
  }, []);

  if ((ideas === undefined) || timeOut)
    return (
      <LoadingComponent timeOutHandler={setTimeOut} 
                        message="Loading Idea Board page. Please wait."/>
    );

  return (
    <div className="flex: 1 container align-items-center justify-content-center">
      <div className="row">
        <ColumnComponent title="New Ideas for Vote" ideas={ideas} type="submitted"/>
        <ColumnComponent title="Proposed Ideas" ideas={ideas} type="proposed"/>
      </div>
    </div>
  );
}