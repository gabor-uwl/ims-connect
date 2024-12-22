import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeContext } from "../components/Employee";
import IdeaFormComponent from "../components/ui/IdeaForm";
import InputBox from "../components/input_fields/InputBox";
import TextBox from "../components/input_fields/TextBox";
import likedImg from "../assets/images/liked.png";
import unlikedImg from "../assets/images/unliked.png";
import axios from "axios";





export default function VoteIdeaPage() {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [idea, setIdea] = useState();
  const [ideaOwner, setIdeaOwner] = useState();
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
        const res = await axios.post(
          "http://localhost:3100/api/idea", {ideaId, employeeId});

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
        const res = await axios.post(
          "http://localhost:3100/api/voteidea", {ideaId, comment, employeeId});
  
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

  if ((idea === undefined) && (ideaOwner === undefined))
    return;

  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row w-100">
          <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>{params.ideaId}</h1>
        <div className="col-2"></div>
        <div className="col-3">
          <IdeaFormComponent idea={idea} disabled={true} />
          <InputBox
            labelText="Submitted by:"
            inputType="text"
            inputValue={ideaOwner.firstName + " " + ideaOwner.lastName}
            isDisabled={true} />
          <InputBox
            labelText="Submition date:"
            inputType="text"
            inputValue={idea.submissionDate}
            isDisabled={true} />
        </div>
        <div className="col-2"></div>
        <div className="col-3 mt-4">
          <button className="btn m-3"
                  type="button"
                  style={{width:"120px"}}
                  onClick={() => navigate("/")}
          >Cancel</button>
          {(idea.state === "submitted") && <div className="mt-3 text-danger">
            {isOwnIdea ? (
              <h5>Your own idea!</h5>
            ):( hasVoted ? (
              <h5>You have already voted!</h5>
            ):(
              <img src={liked ? likedImg : unlikedImg}
                   alt="unliked"
                   style={{width:"50px", height:"50px", cursor:"pointer"}}
                   onClick={() => setLiked(!liked)} />
            ))}
          </div>}
          {liked && <div>
            <TextBox labelText="Comment:"
                     textValue={comment}
                     isRequired={false}
                     onChangeAction={setComment} />
            <button className="btn m-3"
                    type="button"
                    style={{width:"120px"}}
                    onClick={handleVote}
            >Vote</button>
          </div>}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};