import React, { Fragment } from "react";
import { Dropdown } from "primereact/dropdown";

const DropDownComp = (props) => {
    const handleFocus = (event) => event.target.select();

    return (
        <Fragment>
            {
                props.validate ?
                    <div className={props.className} key={props.field}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <Dropdown ref={props.ref} id={props.field} disabled={props.disabled} name={props.field} value={props.value} options={props.options} onChange={props.onChange} onBlur={props.onBlur} placeholder={props.placeholder} optionLabel={props.optionLabel} optionValue={props.optionValue} onFocus={handleFocus}
                            className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} onKeyDown={props.onKeyDown} />
                        {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div>
                :
                    props.title !== ""
                    ?
                        <div className={props.className} key={props.field}>
                            <label htmlFor={props.field}>{props.title}</label>
                            <Dropdown ref={props.ref} id={props.field} disabled={props.disabled} name={props.field} value={props.value} options={props.options} onChange={props.onChange} placeholder={props.placeholder} optionLabel={props.optionLabel} optionValue={props.optionValue} onFocus={handleFocus} onKeyDown={props.onKeyDown} />
                        </div>
                    :
                        <Dropdown className={props.className} ref={props.ref} id={props.field} disabled={props.disabled} name={props.field} value={props.value} options={props.options} onChange={props.onChange} onBlur={props.onBlur} placeholder={props.placeholder} optionLabel={props.optionLabel} optionValue={props.optionValue}  onFocus={handleFocus} onKeyDown={props.onKeyDown} />

            }
        </Fragment>
    )
}

export default DropDownComp;
