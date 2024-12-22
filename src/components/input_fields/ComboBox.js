import Select from "react-select";



export default function ComboBox({labelText, 
                                  defaultOption, 
                                  onChangeAction, 
                                  valueOptions, 
                                  isRequired = true, 
                                  isDisabled = false}) {

  return (
    <div className="text-start mt-3">
      <label>{labelText} {!isRequired && <i> (optional)</i>}</label>
      <Select defaultValue={defaultOption}
              onChange={onChangeAction}
              options={valueOptions}
              required={isRequired}
              isDisabled={isDisabled} />
    </div>
  );
};