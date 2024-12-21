import { useNavigate } from "react-router-dom";
import likedImg from "../../assets/images/liked.png";
import unlikedImg from "../../assets/images/unliked.png";






export default function NewIdeaComponent({idea}) {
  const navigate = useNavigate();

  const viewIdea = () => {
    navigate("/ideas/" + idea.ideaId);
  };

  return (
    <li>
    <div
      className="col rounded border border-dark m-3 idea"
      style={{cursor:"pointer"}}
      onClick={viewIdea}>
      <div className="text-start m-3">
        <h3>{idea.title}</h3>
      </div>
      <div className="row m-3">
        <div className="col text-start">
          <img
            src={(idea.voteCount > 0) ? likedImg : unlikedImg}
            alt="Number of Vote"
            style={{width:"40px", height:"40px"}}/>
          <span className="h5 ms-2">{idea.voteCount}</span>
          </div>
        <div className="col text-end">
          <h5>{idea.ideaId}</h5>
        </div>
      </div>
    </div>
    </li>
  );
};