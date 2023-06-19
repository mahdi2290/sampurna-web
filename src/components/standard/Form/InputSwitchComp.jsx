import React, { Fragment } from "react";
import { InputSwitch } from "primereact/inputswitch";

const InputSwitchComp = (props) => {
    return (
        <Fragment>
            { 
                props.validate ?
                    <div className={props.className} key={props.field}>
                        <h6>{props.title}</h6>
                        <InputSwitch id={props.field} name={props.field} checked={props.checked} onChange={props.onChange} onBlur={props.onBlur} disabled={props.disabled}
                            className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} />
                        {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div> 
                :            
                    <div className={props.className} key={props.field}>
                        <h6>{props.title}</h6>
                        <InputSwitch id={props.field} name={props.field} checked={props.checked} onChange={props.onChange} onBlur={props.onBlur} disabled={props.disabled} />
                    </div>
            }
        </Fragment>
    )
}

export default InputSwitchComp;