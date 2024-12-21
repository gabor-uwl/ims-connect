



export default function InputBox({labelText, 
                                  inputType, 
                                  inputValue, 
                                  onChangeAction, 
                                  isRequired = true, 
                                  isReadOnly = false, 
                                  isDisabled = false}) {

  return (
    <div className="text-start mt-3">
      <label>{labelText} {!isRequired && <i> (optional)</i>}</label>
      <input
        className="form-control"
        type={inputType}
        value={inputValue}
        onChange={(e) => onChangeAction(e.target.value)}
        required={isRequired}
        readOnly={isReadOnly}
        disabled={isDisabled}
      />
    </div>
  );
};