import React, { Fragment, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDateString } from "../../helpers/FormatHelpers";
import { TabView, TabPanel } from 'primereact/tabview';
import InputDatePicker from "../../components/standard/Form/InputDatePicker";
import OrderProduct from "./OrderProduct";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import MenubarComp from "../../components/standard/Menu/MenubarComp";

const OrderDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef();

    const [activeIndex, setActiveIndex] = useState(0);
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
    const [changeStatus, setChangeStatus] = useState(false);
    const [visible, setVisible] = useState(false);

    const [itemModels, setItemModels] = useState([]);
    const [statusModels, setStatusModels] = useState([]);

    let emptyOrder = {
        customer_name: "Pionirbeton Industri",
        shipment_number: "202211130001",
        departure_date: "2022-11-13T11:20:3",
        fleet_category: "WINGBOX",
        fleet_type: "Wing Box",
        origins: "ASM Rumpin",
        destinations: "Pionirbeton Kamal",
        marketing_name: "administrator2",
        note: ""
    }

    let emptyProductModel = {
        id: 0,
        name: "",
        qty: 0,
        volume: 0,
        weight: 0
    }

    useEffect(() => {
        setVisible(false);
        setStartDate(minDate);
        setEndDate(today);

        if (id) {
            getAll();
        }

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getAll = async() => {
        QueryData();
    }

    const getToken = async() => {
        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/auth/token/create";

        const form = new FormData();

        form.append("domain_name", "alamsampurnamakmur")
        form.append("username", "administrator@tms.co.id")
        form.append("password", "administrator")

        const res = await axios({
            method:"POST",
            url:baseUrl,
            data: form,
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        if (res.status === 200) {
            return res.data.data.token;
        }

        return "";
    }

    const QueryData = async() => {
        const token = await getToken();

        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/order/" + id;

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

                const items = result.data.data.items;

                const itemsList = [];
                for (let index = 0; index < items.length; index++) {
                    const array = items[index];

                    itemsList.push({
                        id: index + 1,
                        name: array.name,
                        qty: array.qty,
                        volume: array.volume,
                        weight: array.weight,
                    })
                }
                setItemModels(itemsList);
                setStatusModels(result.data.data.status_history);

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

    const onSetProductModels = (method, data) => {
        setItemModels(prevState => [...prevState, data]);
    }

    const onSubmited = async (values, actions) => {
        if (id) {
            toast.current.show({ severity: "error", summary: "Information", detail: "Saat ini hanya dapat untuk menambah Order", life: 3000 });
            return;
        }

        const token = await getToken();

        const baseUrl = "https://cloudservice.vsms.co.id/tms_public_api/order";

        const itemList = []

        for (let index = 0; index < itemModels.length; index++) {
            const row = itemModels[index];

            itemList.push({
                product: row.name,
                name: row.name,
                qty: row.qty,
                volume: row.volume,
                weight: row.weight,
            })
        }

        const form = {
            customer_name: values.customer_name,
            shipment_number: values.shipment_number,
            departure_time: values.departure_date,
            fleet_category: values.fleet_category,
            fleet_type: values.fleet_type,
            origin: [{
                name: values.origins
            }],
            destination: [{
                name: values.destinations
            }],
            marketing_name: values.marketing_name,
            note: values.note,
            item: itemList
        }

        try {
            const result = await axios({
                method:"POST",
                url:baseUrl,
                data: form,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token,
                }
            });

            if ( result.status === 200 ) {
                history.push({
                    pathname: "/order/edit/" + result.data.data.order_delivery_number,
                    state: {}
                });
            }
        } catch (error) {
            const res = error.response.data;
            const message = res.message;
            const errors = res.errors;

            Object.keys(errors).map(key => {
                return toast.current.show({ severity: "error", summary: message, detail: errors[key], life: 3000 });
            });
        }
    };

    const { values, setValues, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: emptyOrder,
        onSubmit:onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/order/list",
        });
    }

    const backDialog = () => {
        if (changeStatus === false) {
            backURL();
        } else {
            setVisible(true);
        }
    };

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "save":
                handleSubmit();
                break;

            default:
                break;
        }
    }

    const modelDialogFooter = (
        <>
            <Button label="Back" icon="pi pi-chevron-left" className="p-button-text p-button-sm" onClick={backURL} />
            <Button label="Close" icon="pi pi-times" className="p-button-text p-button-sm" onClick={() => setVisible(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text p-button-sm" onClick={handleSubmit} />
        </>
    );

    return <Fragment>
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
            </div>

            <div className="col-12 md:col-4">
                <div className="card">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="p-fluid grid">
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="order_number" title="No Pesanan" value={values.order_number} disabled={true} onChange={handleChange} onBlur={handleBlur} />
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="driver_name" title="Nama Supir" value={values.driver_name} disabled={true} onChange={handleChange} onBlur={handleBlur} />
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="license_plate" title="No Kendaraan" value={values.license_plate} disabled={true} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>

                                <InputTextComp className="field col-12 md:col-6 mb-0" field="shipment_number" title="No Pengiriman" value={values.shipment_number} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="customer_name" title="Nama Pelanggan" value={values.customer_name} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                {/* <InputDatePicker className="field col-12 md:col-6" validate={false} field="departure_date" title="Tgl Keberangkatan" value={values.departure_date} onChange={(e) => setStartDate(e.target.value)} onInput={() => setChangeStatus(true)}/> */}
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="departure_date" title="Tgl Keberangkatan" value={values.departure_date} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="origins" title="Tempat Pengambilan" value={values.origins} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="destinations" title="Tempat Tujuan" value={values.destinations} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="fleet_category" title="Kategori Kendaraan" value={values.fleet_category} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="fleet_type" title="Tipe Kendaraan" value={values.fleet_type} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-6 mb-0" field="marketing_name" title="Nama Sales" value={values.marketing_name} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>
                                <InputTextComp className="field col-12 md:col-12 mb-0" field="note" title="Keterangan" value={values.note} onChange={handleChange} onBlur={handleBlur} onInput={() => setChangeStatus(true)}/>

                        </div>
                    </form>
                </div>
            </div>

            <div className="col-12 md:col-8">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Items">
                        <OrderProduct models={itemModels} setModels={onSetProductModels} empty={emptyProductModel} setChangeStatus={(e) => setChangeStatus(e)}/>
                        {/* <DataTable value={itemModels} emptyMessage="No data found." responsiveLayout="scroll" paginator={true} rows={10} rowsPerPageOptions={[10,20,50]}>
                            <Column field="name" header="Produk" sortable></Column>
                            <Column field="qty" header="Qty" sortable></Column>
                            <Column field="volume" header="Volume" sortable></Column>
                            <Column field="weight" header="Weight" sortable></Column>
                        </DataTable> */}
                    </TabPanel>
                    <TabPanel header="Status">
                        <DataTable value={statusModels} emptyMessage="No data found." responsiveLayout="scroll" paginator={true} rows={10} rowsPerPageOptions={[10,20,50]}>
                            <Column field="datetime" header="Date" sortable></Column>
                            <Column field="status" header="Status" sortable></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Miliage">
                        <div className="p-fluid grid">
                            <InputDatePicker className="field col-12 md:col-3" validate={false} field="start_date" title="Tgl Mulai" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <InputDatePicker className="field col-12 md:col-3" validate={false} field="end_date" title="Tgl Akhir" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <DataTable value={models} emptyMessage="No data found." responsiveLayout="scroll" paginator={true} rows={10} rowsPerPageOptions={[10,20,50]}>
                            <Column field="date" header="Date" sortable></Column>
                            <Column field="mileage" header="Mileage" sortable></Column>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </div>
        </div>


        <Dialog visible={visible} style={{ width: "600px" }} header="Konfirmasi" modal className="p-fluid" footer={modelDialogFooter} onHide={() => setVisible(false)}>
            <p><b>Apakah Anda yakin, Anda akan keluar dari halaman ini?</b></p>
        </Dialog>
    </Fragment>
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(OrderDetail, comparisonFn);
