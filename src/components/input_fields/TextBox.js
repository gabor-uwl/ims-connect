



export default function TextBox({labelText, 
                                 textValue, 
                                 onChangeAction, 
                                 isRequired = true, 
                                 isReadOnly = false, 
                                 isDisabled = false}) {

  return (
    <div className="text-start mt-3">
      <label>{labelText} {!isRequired && <i> (optional)</i>}</label>
      <textarea className="form-control"
                value={textValue}
                readOnly={isReadOnly}
                required={isRequired}
                disabled={isDisabled}
                style={{height:"200px"}}
                onChange={onChangeAction} />
    </div>
  );
};