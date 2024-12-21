import { useNavigate } from "react-router-dom";
import axios from "axios";







export default function MyIdeaComponent({idea}) {
  const navigate = useNavigate();

  const viewIdea = () => {
    navigate("/myideas/" + idea.ideaId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MyIdeaComponent -> idea:", idea);

    try {
      const res = await axios.post("http://localhost:3100/api/submitidea", {ideaId: idea.ideaId});

      if (res.data.state === undefined)
        alert("Unexpected error to submit your idea. Please try to submit it again.")
    }
    catch(err) {
      console.error(err);

      if(err.response === undefined)
        alert(err.message);
      else
        alert(err.response.data.message);
    }

    window.location.reload(true);
  };

  return (
    <li>
      <div className="row">
        <div 
          className="col rounded border m-3 idea" 
          style={{cursor:"pointer"}} 
          onClick={viewIdea}>
          <div className="text-start m-3">
            <h3>{idea.title}</h3>
          </div>
          <div className="row m-3">
            <div className="col rounded border text-center text-light pt-2" style={{maxWidth:"120px"}}>
              <h5>{(idea.submissionDate == null) ? "saved" : "submitted"}</h5>
            </div>
            <div className="col text-end">
              <h5>{idea.ideaId}</h5>
            </div>
          </div>
        </div>
        <div className="col-3 m-3 d-flex align-items-center">
          {(idea.submissionDate == null) && <button className="btn" 
            onClick={handleSubmit} style={{minWidth:"120px"}}>Submit</button>}
        </div>
      </div>
    </li>
  );
};