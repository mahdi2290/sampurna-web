import React from 'react';
import { classNames } from 'primereact/utils';
import { Rating } from 'primereact/rating';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthNamesString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatCurrency(value, digit = 0) {
    if ( value === 0 ) {
        return "-";
    } else {
        return value > 0 ? value.toLocaleString('id-ID', { currency: 'IDR', minimumFractionDigits: digit, maximumFractionDigits: digit }) : "(" + (-1 * value).toLocaleString('id-ID', { currency: 'IDR', minimumFractionDigits: digit, maximumFractionDigits: digit }) + ")";
    }
}

export function formatBoolen(value) {
    // const data = value === 1 ? true : false;
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle': value, 'text-pink-500 pi-times-circle': !value })}></i>;
}

export function numberFormat(value, digit) {
    if ( value === 0 ) {
        return "-";
    } else {
        return value.toFixed(digit)
    }
}

export function formatToDate(value) {
    if (value !== null) {
        const array = value.split("-");

        const date = new Date(array[0], array[1], array[2])

        return date;
    }

    return ""
}

export function formatDate(value) {
    return value.toLocaleDateString('en-En', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
}

export function formatDateString(value) {
    const date = new Date(value);
    let result = date.getFullYear() + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) ;

    return result;
}

export function formatDateFrom(value) {
    const date = new Date(value);
    let month = date.getMonth();
    let year = date.getFullYear();
    if (date.getMonth() === 0) {
        month = 12;
        year = year - 1;
    }
    let result = year + "-" + ('0' + (month)).slice(-2) + "-21" ;

    return result;
}

export function formatDateTo(value) {
    const date = new Date(value);
    let result = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-20" ;

    return result;
}

export function formatDateTimeString(value) {
    const date = new Date(value);
    let result = date.getFullYear() + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);

    return result;
}

export function formatDateFullString(value) {
    const date = new Date(value);
    let result = ('0' + date.getDate()).slice(-2) + " " + monthNames[(date.getMonth())] + " " + date.getFullYear();

    return result;
}

export function formatDateReport(value) {
    const date = new Date(value);
    let result = ('0' + date.getDate()).slice(-2) + " " + monthNamesString[(date.getMonth())] + " " + date.getFullYear();

    return result;
}

export function formatDateTimeReport(value) {
    const date = new Date(value);
    let result = ('0' + date.getDate()).slice(-2) + " " + monthNamesString[(date.getMonth())] + " " + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);

    return result;
}

export function formatDateTimeFullString(value) {
    const date = new Date(value);
    let result = ('0' + date.getDate()).slice(-2) + " " + monthNames[(date.getMonth())] + " " + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);

    return result;
}

export function formatRating(value) {
    return <Rating value={value} readOnly cancel={false} />;
}

export function formatSlider(options) {
    return <React.Fragment>
        <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
        <div className="flex align-items-center justify-content-between px-2">
            <span>{options.value ? options.value[0] : 0}</span>
            <span>{options.value ? options.value[1] : 100}</span>
        </div>
    </React.Fragment>
}

export function formatCheckbox(options) {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />
}

export function formatImage(pathname, value) {
    return <img src={`${pathname}${value}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={value} className="shadow-2" width={100} />;
}

export function formatCalender(options) {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />
}

export function formatProgressBar(value) {
    return <ProgressBar value={value} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
}
