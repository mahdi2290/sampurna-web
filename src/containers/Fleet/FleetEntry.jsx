import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import InputSwitchComp from "../../components/standard/Form/InputSwitchComp";
import { formatDateString } from "../../helpers/FormatHelpers";

import * as HeaderService from '../../service/Fleet/FleetService';
import { APICompany, APIFleetTypeAll } from "../../components/api/APIMaster";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const FleetEntry = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef(null);

    const [statusNew, setStatusNew] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);

    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [fleetTypeData, setFleetTypeData] = useState([]);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);

    const [tubStatusFlag, setTubStatusFlag] = useState(false);
    const [statusFlag, setStatusFlag] = useState(false);

    let emptyModel = {
        id: 0,
        company_id: { id: 0 },
        fleet_type_id: { id: 0 },
        plate_no: "",
        owner: "",
        stnk: "",
        bpkb: "",
        color: "",
        engine_no: "",
        chassis_no: "",
        register_date: formatDateString(new Date()),
        sell_date: null,
        sell_to: "",
        length: 0,
        width: 0,
        height: 0,
        tub_no: "",
        tub_status_new: 0,
        status: 0
    };

    const getCompany = async (keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(null);

        return res;
    }

    const getFleetType = async (keyword) => {
        const res = await APIFleetTypeAll(keyword);

        setFleetTypeData(null);

        return res;
    }

    const onChangeCompany = (e) => {
        setCompanySelect(e.value);
    }

    const QueryData = async () => {
        if (id) {
            const res = await HeaderService.GetByID(id);

            if (res.status === 200) {
                const querydata = res.data;

                setValues(querydata);

                setCompanySelect(querydata.company_id);
                setFleetTypeSelect(querydata.fleet_type_id);

                setStatusFlag(false);
                if (querydata.status === 1) {
                    setStatusFlag(true);
                }

                setTubStatusFlag(false);
                if (querydata.tub_status_new === 1) {
                    setTubStatusFlag(true);
                }

                setStatusNew(false);
            } else {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data tidak ditemukan", life: 3000 });
            }
        } else {
            setValues(emptyModel);
            setCompanySelect(null);
            setFleetTypeSelect(null);
            setStatusFlag(false);
            setTubStatusFlag(false);
            setChangeStatus(false);

            setStatusNew(true);
        }

        setCompanyData(null);
        setFleetTypeData(null);
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = null;
        let result = null;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            let valueData = "";
            if (values.hasOwnProperty(key)) {
                if (values[key] === null ) {
                    valueData = "";
                } else {
                    if (key.includes("date")) {
                        if (!statusNew) {
                            valueData = formatDateString(new Date(values[key]));
                        } else {
                            valueData = values[key];
                        }
                    } else {
                        valueData = values[key];
                    }
                }
            }

            if (key !== "id") {
                if (valueData.hasOwnProperty('id')) {
                    form.append(key, valueData.id);
                } else {
                    form.append(key, valueData);
                }
            }

            return key;
        });

        // console.log(id, [...form])

        if (id) {
            result = await HeaderService.PutData(id, form);
        } else {
            result = await HeaderService.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id
            } else {
                data_id = result.data.id;
            }

            setTimeout(() => {
                setWaiting(false);
                setChangeStatus(false);
                setVisible(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });

                if (statusNew === false) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/fleet/edit/" + data_id,
                        state: {}
                    });
                }
            }, 1000);
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
            setWaiting(false);
        } else if (result.status === 401) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
            setWaiting(false);
        } else if (result.status === 402) {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/fleet/list",
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

            case "new":
                if (statusNew) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/fleet/create",
                    });
                }
                window.location.reload();
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        setVisible(false);

        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>

                    <div className="col-12">
                        <div className="grid">
                            <div className="col-12 md:col-12 lg:col12">
                                <Panel header="Input Fleet" className="h-full">
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="p-fluid">
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="company_id" title="Grup Perusahaan" showField="name" errors={errors} touched={touched} models={companyData}
                                                    queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => setCompanySelect(e)} onChange={(e) => { onChangeCompany(e); values.company_id = e.value.id; }} />
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="fleet_type_id" title="Jenis Kendaraan" showField="name" errors={errors} touched={touched} models={fleetTypeData}
                                                    queryData={(e) => getFleetType(e)} value={fleetTypeSelect} setSelectValue={(e) => setFleetTypeSelect(e)} onChange={(e) => { setFleetTypeSelect(e.value); values.fleet_type_id = e.value.id; }} />
                                                <InputTextComp className="field col-12 md:col-4" validate={true} field="plate_no" title="No Kendaraan" value={values.plate_no} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-4" validate={true} field="owner" title="Nama Pemilik" value={values.owner} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-3" validate={true} field="stnk" title="No STNK" value={values.stnk} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-3" validate={true} field="bpkb" title="No BPKB" value={values.bpkb} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-2" validate={true} field="color" title="Warna" value={values.color} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <DatePickerComp className="field col-12 md:col-3" validate={true} field="register_date" title="Tgl Register" value={values.register_date} onChange={(e) => { values.register_date = e; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-4" validate={true} field="engine_no" title="No Mesin" value={values.engine_no} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-4" validate={true} field="chassis_no" title="No Rangka" value={values.chassis_no} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <DatePickerComp className="field col-12 md:col-3" validate={true} field="sell_date" title="Tgl Jual" value={values.sell_date} onChange={(e) => { values.sell_date = e; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-3" validate={true} field="sell_to" title="Nama Pembeli" value={values.sell_to} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="length" title="Panjang" value={values.length} minFractionDigits={4} maxFractionDigits={4} onChange={(e) => { values.length = e.value; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="width" title="Lebar" value={values.width} minFractionDigits={4} maxFractionDigits={4} onChange={(e) => { values.width = e.value; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="height" title="Tinggi" value={values.height} minFractionDigits={4} maxFractionDigits={4} onChange={(e) => { values.height = e.value; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputTextComp className="field col-12 md:col-3" validate={true} field="tub_no" title="No Bak" value={values.tub_no} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputSwitchComp className="field col-12 md:col-2" validate={true} field="tub_status_new" title="Bak Baru" checked={tubStatusFlag} onChange={(e) => { setTubStatusFlag(e.value); values.tub_status_new = e.value ? 1 : 0; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                                <InputSwitchComp className="field col-12 md:col-2" validate={true} field="status" title="Status" checked={statusFlag} onChange={(e) => { setStatusFlag(e.value); values.status = e.value ? 1 : 0; }} onBlur={handleBlur} errors={errors} touched={touched} />
                                            </div>
                                        </div>
                                    </form>
                                </Panel>
                            </div>
                        </div>

                        <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
                    </div>
                </div >
            </div >
        </Fragment >
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(FleetEntry, comparisonFn);
