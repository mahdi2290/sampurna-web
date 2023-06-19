import React, { Fragment } from "react";
import { InputTextarea } from "primereact/inputtextarea";

const InputTextAreaComp = (props) => {
    return (
        <Fragment>
            { 
                props.validate ?
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <InputTextarea id={props.field} name={props.field} value={props.value} placeholder={props.placeholder} rows={props.rows}
                            onChange={props.onChange} onBlur={props.onBlur} onInput={props.onInput}
                            className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} />
                        {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div> 
                :
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <InputTextarea key={props.field} id={props.field} name={props.field} value={props.value} placeholder={props.placeholder} rows={props.rows}
                            onChange={props.onChange} onBlur={props.onBlur} onInput={props.onInput} />                
                    </div>
            }
        </Fragment>
    )
}

export default InputTextAreaComp;