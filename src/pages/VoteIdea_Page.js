import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { EmployeeContext } from "../components/Employee";
import IdeaFormComponent from "../components/ui/IdeaForm";
import InputBox from "../components/input_fields/InputBox";
import likedImg from "../assets/images/liked.png";
import unlikedImg from "../assets/images/unliked.png";



export default function VoteIdeaPage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [idea, setIdea] = useState(null);
  const [ideaOwner, setIdeaOwner] = useState(null);
  const [hasVoted, setHasVoted] = useState(true);
  const [isOwnIdea, setIsOwnIdea] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState(null);
  const navigate = useNavigate();

  let params = useParams();
  const ideaId = params.ideaId;

  useEffect( () => {
    const fetchIdea = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/idea", {ideaId, employeeId});

        console.log(res.data);
        setIdea(res.data.idea);
        setIdeaOwner(res.data.employee);
        setHasVoted(res.data.hasVoted);
        setIsOwnIdea(res.data.idea.employeeId === employeeId)
      }
      catch(err) {
        navigate("/");
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    fetchIdea();
  }, [ideaId, employeeId, navigate]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (liked) {
      try {
        const res = await axios.post("http://localhost:3100/api/voteidea", {ideaId, comment, employeeId});
  
        if (res.data.state === undefined)
          alert("Unexpected error to vote for idea. Please try to vote again.")
        }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    }
    navigate("/");
  };

  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
          <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>{params.ideaId}</h1>
          <IdeaFormComponent idea={idea} disabled={true} />
          <InputBox
            labelText="Submitted by:"
            inputType="text"
            inputValue={ideaOwner ? ideaOwner.firstName + " " + ideaOwner.lastName : ""}
            isDisabled={true} />
          <InputBox
            labelText="Submition date:"
            inputType="text"
            inputValue={idea ? idea.submissionDate : ""}
            isDisabled={true} />
        </div>
        <div className="row w-100 justify-content-center">
          <div className="col-2 align-self-center">
            {isOwnIdea ? (
              "Your own idea!"
            ):( hasVoted ? (
              "You have already voted!"
            ):(
              <img
                src={liked ? likedImg : unlikedImg}
                alt="unliked"
                style={{width:"50px", height:"50px", cursor:"pointer"}}
                onClick={() => setLiked(!liked)} />
            ))}
          </div>
          <div className="col-2 justify-content-center">
            <button
              className="btn btn-primary m-3"
              type="button"
              style={{width:"120px"}}
              onClick={handleVote}>
              {liked ? "Save" : "Close"}
            </button>
          </div>
        </div>
        {liked && <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 text-start mx-auto">
          <label>Comment:</label>
          <textarea
            className="form-control"
            value={comment}
            style={{height:"200px"}}
            onChange={(e) => setComment(e.target.value)} />
        </div>}
      </div>
    </div>
  );
};