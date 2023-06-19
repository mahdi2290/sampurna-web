import React, { Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { formatDateString } from "../../helpers/FormatHelpers";

const OrderDetail = (props) => {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;

    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);

    let maxDate = new Date();
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);

    const [models, setModels] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {
        setStartDate(minDate);
        setEndDate(today);

        getAll();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getAll = async() => {           
        getToken();
    }

    const getToken = async() => {
        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/auth/token/create";
        
        const form = new FormData();
                    
        form.append("domain_name", "alamsampurnamakmur")
        form.append("username", "administrator@tms.co.id")
        form.append("password", "administrator")
        
        await axios({
            method:"POST",
            url:baseUrl, 
            data: form,
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        })
        .then(res => getOrderDetail(res.data.data.token)); 
    }

    const getOrderDetail = async(token) => {
        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/order/" + props.match.params.do;

        try {
            const result = await axios({
                method:"GET",
                url:baseUrl, 
                data: {},
                headers: {
                    'Content-Type': 'application/json',   
                    'Authorization': "Bearer " + token,
                }
            });

            if (result.status === 200) {
                setValues(result.data.data);

                getListTrip(result.data.data.license_plate);
            }
        } catch (error) {
            console.log("error", error.response.data)
        }
    }
    
    const storeDate = (result) => {
        let start_date = minDate;
        if (startDate === null || isNaN(startDate)) {
            setStartDate(minDate);
        } else {
            start_date = startDate
        }

        let end_date = today;
        if (endDate === null || isNaN(endDate)) {
            setEndDate(today);
        } else {
            end_date = startDate
        }

        let loop = start_date;
        while (loop <= end_date) {              
            const date = formatDateString(loop);

            let mileage = 0;
            for (var key in result) {
                let data = result[key];

                const start_time = new Date(data.start_time);
                const date_string = formatDateString(start_time);

                if (date_string === date) {
                    mileage = mileage + parseFloat(data.trip_mileage);
                }
            }

            const data = {
                date: date,
                mileage: mileage.toFixed(2)
            }

            setModels(models => [...models, data]);

            const newDate = loop.setDate(loop.getDate() + 1);  
            loop = new Date(newDate);  
        }
    }

    const getListTrip = async(license_plate) => {
        const baseUrl = "https://serv.vsms.co.id/api/livedata/trip_list";
        
        let start_date = minDate;
        if (startDate === null || isNaN(startDate)) {
            setStartDate(minDate);
        } else {
            start_date = startDate
        }

        let end_date = today;
        if (endDate === null || isNaN(endDate)) {
            setEndDate(today);
        } else {
            end_date = startDate
        }

        let parseDate = new Date(start_date);

        let start_date_string = "";
        let end_date_string = "";

        if (parseDate === "Invalid Date" || isNaN(parseDate)) {
            start_date_string = "";
        } else {
            start_date_string = formatDateString(parseDate);
        }

        parseDate = new Date(end_date);
    
        if (parseDate === "Invalid Date" || isNaN(parseDate)) {
            end_date_string = "";
        } else {
            end_date_string = formatDateString(parseDate);
        }

        const result = await axios({
            method:"GET",
            url:baseUrl, 
            headers: {
                'Content-Type': 'application/json',   
                'Authorization': "Bearer eee7f1550915b8e8eb900e98f7659661",
            },
            params: {
                ref: license_plate,
                start_date: start_date_string,
                end_date: end_date_string
            }
        });

        if (result.status === 200) {
            const resultList = result.data.data;

            storeDate(resultList);            
        }
    }

    const { values, setValues } = useFormik({
        initialValues: {},
    });

    return <Fragment>
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="customer_name">Nama Customer</label>
                            <InputText id="customer_name" value={values.customer_name} />
                        </div>
                        <div className="field">
                            <label htmlFor="departure_date">Tgl Keberangkatan</label>
                            <InputText id="departure_date" value={values.departure_date} />
                        </div>
                        <div className="field">
                            <label htmlFor="order_number">No Pesanan</label>
                            <InputText id="order_number" value={values.order_number} />
                        </div>
                        <div className="field">
                            <label htmlFor="origins">Tempat Pengambilan</label>
                            <InputText id="origins" value={values.origins} />
                        </div>
                        <div className="field">
                            <label htmlFor="destinations">Tempat Tujuan</label>
                            <InputText id="destinations" value={values.destinations} />
                        </div>
                        <div className="field">
                            <label htmlFor="license_plate">No Kendaraan</label>
                            <InputText id="license_plate" value={values.license_plate} />
                        </div>
                        <div className="field">
                            <label htmlFor="driver_name">Nama Supir</label>
                            <InputText id="driver_name" value={values.driver_name} />
                        </div>
                        <div className="field">
                            <label htmlFor="fleet_category">Kategori Kendaraan</label>
                            <InputText id="fleet_category" value={values.fleet_category} />
                        </div>
                        <div className="field">
                            <label htmlFor="fleet_type">Tipe Kendaraan</label>
                            <InputText id="fleet_type" value={values.fleet_type} />
                        </div>
                        <div className="field">
                            <label htmlFor="fleet_type">Tipe Kendaraan</label>
                            <InputText id="fleet_type" value={values.fleet_type} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-12 md:col-6">
                <div className="grid">
                    <div className="col-4 p-fluid">
                        <div className="field">
                            <label htmlFor="start_date">Start Date</label>
                            <Calendar id="start_date" name="start_date" value={startDate} onChange={(e)=> setStartDate(e.value)} showIcon />
                        </div>
                    </div>
                    <div className="col-4 p-fluid">
                        <div className="field">
                            <label htmlFor="end_date">End Date</label>
                            <Calendar id="end_date" name="end_date" value={endDate} onChange={(e)=> setEndDate(e.value)} showIcon />
                        </div>
                    </div>
                </div>
                <DataTable value={models} emptyMessage="No data found." responsiveLayout="scroll" paginator={true} rows={10} rowsPerPageOptions={[10,20,50]}>
                    <Column field="date" header="Date" sortable></Column>                 
                    <Column field="mileage" header="Mileage" sortable></Column>
                </DataTable>
            </div>
        </div>
    </Fragment>
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(OrderDetail, comparisonFn);