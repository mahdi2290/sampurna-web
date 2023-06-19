import React, { Fragment, useState, useEffect } from "react";
import { AutoComplete } from 'primereact/autocomplete';

const AutoCompleteComp = (props) => {
    const handleFocus = (event) => event.target.select();

    const [autoFiltered, setAutoFiltered] = useState([]);
    const [inputValue, setInputValue] = useState(null);
    const [selected, setSelected] = useState(null);

    const search = async(event) => {
        const selectedValue = event.query;

        setInputValue(selectedValue);

        if (props.api) {
            if (!selectedValue || selectedValue.length === 0) {
                if (props.models !== null ) {
                    setAutoFiltered([...props.models]);
                } else {
                    const data = await props.queryData("");

                    setAutoFiltered(data);
                }
            } else {
                const data = await props.queryData(selectedValue);

                setAutoFiltered(data);
            }
        } else {
            if (!selectedValue || selectedValue.length === 0) {
                setAutoFiltered([...props.models]);
            }
            else {
                setAutoFiltered(props.models.filter((model) => {
                    return model[props.filterName].toLowerCase().includes(event.query.toLowerCase());
                }));
            }
        }
    };

    const onBlur = () => {
        // if (!props.blur) {
            if (!selected) {
                if (autoFiltered !== null) {
                    if (!inputValue || inputValue.length === 0 || inputValue === null) {
                        setInputValue(null);
                        props.setSelectValue([]);
                    } else {
                        const before = [...autoFiltered];
                        if (before) {
                            setSelected(before[0]);
                            props.setSelectValue(before[0]);
                        }
                    }
                } else {
                    setInputValue(null);
                    props.setSelectValue([]);
                }
            } else {
                if (selected.hasOwnProperty('id')) {
                    props.setSelectValue(selected);
                } else {
                    if (autoFiltered !== null) {
                        if (!inputValue || inputValue.length === 0 || inputValue === null) {
                            setInputValue(null);
                            props.setSelectValue([]);
                        } else {
                            const before = [...autoFiltered];
                            if (before) {
                                setSelected(before[0]);
                                props.setSelectValue(before[0]);
                            }
                        }
                    } else {
                        setInputValue(null);
                        props.setSelectValue([]);
                    }
                }
            }
        // }
    }

    const onChange = (event) => {
        setSelected(event.value);
        props.onChange(event);
    }

    useEffect(() => {
        if (props.models !== null ) {
            setAutoFiltered([...props.models]);
        }
        setSelected(props.value);
    }, [props]);

    return (
        <Fragment>
            {
                props.validate ?
                    props.title !== "" ?
                    <div className={props.className} key={props.field}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <AutoComplete id={props.field} ref={props.ref} name={props.field} forceSelection={false} dropdown multiple={false} dropdownAutoFocus={true} onFocus={handleFocus} onKeyDown={props.onKeyDown}
                            value={props.value} suggestions={autoFiltered} onBlur={onBlur} completeMethod={search} onInput={(e) => setInputValue(e.target.value)} itemTemplate={props.itemTemplate}
                            field={props.showField} onChange={onChange} minLength={1} disabled={props.disabled} className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} />
                            {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </div>
                    :
                    <>
                        <AutoComplete id={props.field} ref={props.ref} name={props.field} forceSelection={false} dropdown multiple={false} dropdownAutoFocus={true} onFocus={handleFocus} onKeyDown={props.onKeyDown}
                            value={props.value} suggestions={autoFiltered} onBlur={onBlur} completeMethod={search} onInput={(e) => setInputValue(e.target.value)} itemTemplate={props.itemTemplate}
                            field={props.showField} onChange={onChange} minLength={1} disabled={props.disabled} className={props.errors[props.field] && props.touched[props.field] ? "p-invalid" : ""} />
                            {props.errors[props.field] && props.touched[props.field] && ( <small id="username-help" className="p-error"> {props.errors[props.field]}</small> )}
                    </>
                :
                    props.title !== "" ?
                        <div className={props.className} key={props.field}>
                            <label htmlFor={props.field}>{props.title}</label>
                            <AutoComplete id={props.field} ref={props.ref} name={props.field} forceSelection={props.forceSelection} dropdown multiple={false} dropdownAutoFocus={true} itemTemplate={props.itemTemplate}
                                value={props.value} suggestions={autoFiltered} disabled={props.disabled} completeMethod={search} onBlur={onBlur} minLength={1} onInput={(e) => setInputValue(e.target.value)} onKeyDown={props.onKeyDown}
                                field={props.showField} onChange={onChange} onFocus={handleFocus}/>
                        </div>
                    :
                    <>
                        <AutoComplete className={props.className} id={props.field} ref={props.ref} name={props.field} forceSelection={props.forceSelection} dropdown multiple={false} dropdownAutoFocus={true} onKeyDown={props.onKeyDown}
                            value={props.value} suggestions={autoFiltered} disabled={props.disabled} completeMethod={search} onBlur={onBlur} minLength={1} onInput={(e) => setInputValue(e.target.value)} itemTemplate={props.itemTemplate}
                            field={props.showField} onChange={onChange} onFocus={handleFocus}/>
                    </>
            }
        </Fragment>
    )
}

export default AutoCompleteComp;
