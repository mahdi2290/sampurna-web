import React, { Fragment } from "react";
import { InputNumber } from "primereact/inputnumber";

const InputNumberComp = (props) => {
    const handleFocus = (event) => event.target.select();

    return (
        <Fragment>
            {
                props.validate ?
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <InputNumber key={props.field} id={props.field} name={props.field} value={props.value} placeholder={props.placeholder} onFocus={handleFocus}
                            minFractionDigits={props.minFractionDigits} maxFractionDigits={props.maxFractionDigits} onKeyDown={props.onKeyDown}
                            onChange={props.onChange} onBlur={props.onBlur} onInput={props.onInput} disabled={props.disabled}
                            className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} mode="decimal" locale="en-US"   />
                        {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div>
                :
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <InputNumber key={props.field} id={props.field} name={props.field} value={props.value} placeholder={props.placeholder} onFocus={handleFocus}
                            minFractionDigits={props.minFractionDigits} maxFractionDigits={props.maxFractionDigits} onKeyDown={props.onKeyDown}
                            onChange={props.onChange} onBlur={props.onBlur} onInput={props.onInput} disabled={props.disabled} mode="decimal" locale="en-US"   />
                    </div>
            }
        </Fragment>
    )
}

export default InputNumberComp;
