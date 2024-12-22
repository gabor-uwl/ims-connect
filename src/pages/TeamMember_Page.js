import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComboBox from "../components/input_fields/ComboBox";
import axios from "axios";





export default function TeamMemberPage() {
  const [teamMemberOptions, setTeamMemberOptions] =useState();
  const [teamMemberId, setTeamMemberId] = useState();
  const [teamMember, setTeamMember] = useState();
  const navigate = useNavigate();

  let params = useParams();
  const projectId = params.projectId;

  useEffect( () => {
    const fetchNewTeamMembers = async () => {
      try {
        const res = await axios.post("http://localhost:3100/api/newteammembers", {projectId});

        setTeamMemberOptions(res.data.newTeamMembers);
      }
      catch(err) {
        console.error(err);
  
        if(err.response === undefined)
          alert(err.message);
        else
          alert(err.response.data.message);
      }
    };

    fetchNewTeamMembers();
  }, [projectId]);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3100/api/task/addteammember", {teamMemberId, projectId});

      if (res.data.state === undefined)
        alert("Unexpected error to add team member. Please try to add again.")
    }
    catch(err) {
      console.error(err);

      if(err.response === undefined)
        alert(err.message);
      else
        alert(err.response.data.message);
    }

    navigate("/projects/" + projectId);
  };

  const handleTeamMemberChange = (e) => {
    setTeamMember(e);
    setTeamMemberId(e.value);
  };

  return (
    <div className="flex: 1 container d-flex align-items-center justify-content-center">
      <div className="row m-3">
        <h1 className="m-4" style={{fontFamily: "cursive"}}>
          {projectId}
        </h1>
        <div className="col">
          <form onSubmit={handleAdd}>
            <ComboBox labelText="New Team Member:" 
                      defaultOption={teamMember}
                      onChangeAction={handleTeamMemberChange}
                      valueOptions={teamMemberOptions} />
            <div className="d-flex justify-content-center pt-5">
              <button className="btn w-100 mx-3" 
                      type="button" 
                      onClick={() => navigate("/projects/" + projectId)}
              >Cancel</button>
              <button className="btn w-100 mx-5" 
                      type="submit"
              >Add To Team</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};