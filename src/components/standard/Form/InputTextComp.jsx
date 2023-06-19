import React, { Fragment } from "react";
import { InputText } from "primereact/inputtext";

const InputTextComp = (props) => {
    const handleFocus = (event) => event.target.select();

    return (
        <Fragment>
            {
                props.validate ?
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <InputText id={props.field} name={props.field} keyfilter={props.keyfilter} value={props.value} placeholder={props.placeholder} onKeyDown={props.onKeyDown}
                            onChange={props.onChange} onBlur={props.onBlur} onInput={props.onInput} disabled={props.disabled} onFocus={handleFocus}
                            className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} />
                        {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div>
                :
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <InputText id={props.field} name={props.field} keyfilter={props.keyfilter} value={props.value} placeholder={props.placeholder} onFocus={handleFocus}
                            onChange={props.onChange} onBlur={props.onBlur} onInput={props.onInput} disabled={props.disabled} onKeyDown={props.onKeyDown} />
                    </div>
            }
        </Fragment>
    )
}

export default InputTextComp;
