import React, { Fragment } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Chip } from "primereact/chip";

const MultiSelectComp = (props) => {
    const itemTemplate = (option) => {
        return (
            <div key={option.id} className="country-item">
            <div>{option[props.showField]}</div>
            </div>
        );
    }

    const onRemove = (e) => {
        let _before = [...props.value];
        let _models = _before.filter(val => val.id !== e.id);

        props.onChange({value : _models});
    }

    const selectedTemplate = (option) => {
        if (option) {
            return (
                <div key={option.id} className="country-item country-item-value">
                    {/* <div>{option[props.showField]}</div>                     */}
                    <Chip label={option[props.showField]} className="mb-2 custom-chip" removable onRemove={() => onRemove(option)} />
                </div>
            );
        }

        return "Select item";
    }

    return (
        <Fragment>
            {
                props.validate ?
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <MultiSelect key={props.field} id={props.field} name={props.field} disabled={props.disabled} itemTemplate={itemTemplate} selectedItemTemplate={selectedTemplate} display="chip" optionLabel={props.optionLabel} fixedPlaceholder={true}
                            value={props.value} options={props.options} onChange={props.onChange} className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} />
                            {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div>
                :
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <MultiSelect key={props.field} id={props.field} name={props.field} disabled={props.disabled} itemTemplate={itemTemplate} selectedItemTemplate={selectedTemplate} display="chip" optionLabel={props.optionLabel} fixedPlaceholder={true}
                            value={props.value} options={props.options} onChange={props.onChange} />
                    </div>
            }
        </Fragment>
    )
}

export default MultiSelectComp;
