import React, { Fragment, useState, useEffect } from "react";

const InputDatePicker = (props) => {
    const [date, setDate] = useState();
    
    useEffect(() =>{
        if (props.value !== null) {
            const value = new Date(props.value);

            setDate(value.toLocaleDateString('en-CA'));
        }
    }, [props.value]);

    const onChange = (e) => {
        setDate(e.target.value);
        props.onChange(e);
    }

    return (
        <Fragment>
            { 
                props.validate ?
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <input type="date" ref={props.ref} id={props.field} name={props.field} value={date} onChange={onChange} onBlur={props.onBlur} onInput={props.onInput} disabled={false} data-date-format="dd/mm/yyyy"
                            className={props.errors[props.field] && props.touched[props.field] ? "p-inputtext p-invalid" : "p-inputtext"} />
                    </div>
                : 
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <input type="date" ref={props.ref} id={props.field} name={props.field} value={date} onChange={onChange} onBlur={props.onBlur} onInput={props.onInput} className="p-inputtext" data-date-format="dd/mm/yyyy" />
                    </div>
            }
        </Fragment>
    )
}

export default InputDatePicker;