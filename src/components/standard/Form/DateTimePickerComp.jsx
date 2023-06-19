import React, { Fragment, useState, useEffect, useRef } from "react";
import { InputMask } from "primereact/inputmask";
import { Calendar } from 'primereact/calendar';

import { formatDateTimeString } from "../../../helpers/FormatHelpers";

const DateTimePickerComp = (props) => {
    const myRef = useRef(null);
    const [calendar, setCalendar] = useState('');
    const [date, setDate] = useState('');
    const [open, setOpen] = useState(false);
    const dateNew = new Date();
    const today = dateNew.toLocaleDateString('id', { weekday: 'long' });

    const handleSelect = (e) => {
        const data = formatDateTimeString(e.value);
        setDate(data);
        setOpen(false);
        props.onChange(data);
    }

    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setOpen(false);
        }
    }

    const hideOnClickOutside = (e) => {
        if (myRef.current && !myRef.current.contains(e.target)) {
            setOpen(false);
        }
    }

    const changeDate = (e) => {
        let data = new Date(e.value);

        if (!isNaN(data)) {
            setCalendar(data);
            setDate(formatDateTimeString(data));
            props.onChange(formatDateTimeString(data));
        }
    }

    useEffect(() => {
        if ( props.value !== null && props.value !== "" ) {
            const year = parseInt(props.value.substr(0, 4));
            const month = parseInt(props.value.substr(5, 2));
            const day = parseInt(props.value.substr(8, 2));

            const hour = parseInt(props.value.substr(11, 2));
            const minute = parseInt(props.value.substr(14, 2));
            const seconds = parseInt(props.value.substr(17, 2));

            const newDate = new Date(year, month === 0 ? 12 : month - 1, day, hour, minute, seconds);

            setCalendar(newDate);
            setDate(formatDateTimeString(newDate));
        } else {
            setCalendar(today);
            setDate('');
        }

        document.addEventListener("keydown", hideOnEscape, true);
        document.addEventListener("click", hideOnClickOutside, true);
    }, [props.value]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            {
                props.validate ?
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputMask id="date" mask="9999-99-99 99:99" disabled={props.disabled} value={date} onChange={(e) => changeDate(e)} onBlur={(e) => changeDate(e.target)} slotChar="yyyy/mm/dd hh:mm" onClick={() => props.disabled ? null : setOpen(open => !open) } className={props.errors[props.field] && props.touched[props.field] ? "p-inputtext p-invalid" : "p-inputtext"} />
                            </span>
                            <span className="p-inputgroup-addon" onClick={() => props.disabled ? null : setOpen(open => !open) }>
                                <i className="pi pi-calendar"></i>
                            </span>
                        </div>
                        <div className="calendarWrap">
                            <div ref={myRef}>
                                {
                                    open &&
                                    <Calendar value={calendar} onChange={handleSelect} onBlur={props.onBlur} className="calendarElement" showTime inline />
                                }
                            </div>
                        </div>
                    </div>
                :
                    <div className={props.className}>
                        <label htmlFor={props.field}>{props.title}</label>
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputMask id="date" mask="9999-99-99 99:99" disabled={props.disabled} value={date} onChange={(e) => changeDate(e)} onBlur={(e) => changeDate(e.target)} slotChar="yyyy/mm/dd hh:mm" onClick={() => props.disabled ? null : setOpen(open => !open) }/>
                            </span>
                            <span className="p-inputgroup-addon" onClick={() => setOpen(open => !open) }>
                                <i className="pi pi-calendar"></i>
                            </span>
                        </div>
                        <div className="calendarWrap">
                            <div ref={myRef}>
                                {
                                    open &&
                                    <Calendar date={calendar} onChange={handleSelect} onBlur={props.onBlur} className="calendarElement" showTime inline/>
                                }
                            </div>
                        </div>
                    </div>
            }
        </Fragment>
    )
}

export default DateTimePickerComp;
