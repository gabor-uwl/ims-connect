import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "../input_fields/InputBox";
import TextBox from "../input_fields/TextBox";
import { EmployeeContext } from "../Employee";
import axios from "axios";



export default function IdeaFormComponent({idea, disabled = false}) {
  const employeeId = useContext(EmployeeContext).employeeId;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDisabled, setIsDisabled] = useState(disabled);
  const navigate = useNavigate();

  useEffect( () => {
    if (idea != null) {
      setTitle(idea.title);
      setDescription(idea.description);
      if (!disabled)
        setIsDisabled(idea.submissionDate != null);
    }
  }, [idea, disabled]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (idea != null) {
      if ((idea.title === title) && (idea.description === description)) {
        navigate("/myideas");
        return;
      }
    }

    console.log("IdeaFormComponent -> idea:", title, description);

    try {
      const res = await axios.post("http://localhost:3100/api/saveidea", {idea, title, description, employeeId});

      if (res.data.state === undefined)
        alert("Unexpected error to save your idea. Please try to create it again.")
    }
    catch(err) {
      console.error(err);

      if(err.response === undefined)
        alert(err.message);
      else
        alert(err.response.data.message);
    }

    navigate("/myideas");
  };

  return (
    <form onSubmit={handleSave}>
      <InputBox labelText="Title:"
                inputType="text"
                inputValue={title}
                onChangeAction={setTitle}
                isDisabled={isDisabled} />
      <TextBox  labelText="Description:" 
                textValue={description} 
                isDisabled={isDisabled} 
                onChangeAction={(e) => setDescription(e.target.value)} />
      {!disabled && <div className="d-flex justify-content-center pt-3">
        <button className={"btn w-100 mx-5" + (isDisabled ? " disabled" : "")} type="submit">Save</button>
        <button className="btn w-100 mx-5" type="button" onClick={() => navigate("/myideas")}>
          {(idea != null) ? "Close" : "Cancel"}
        </button>
      </div>}
    </form>
  );
};