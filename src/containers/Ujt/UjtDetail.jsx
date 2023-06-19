import React, { useEffect, useState, useRef, Fragment } from "react";
import { Panel } from 'primereact/panel';
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";

import * as HeaderService from '../../service/Ujt/UjtService';

import { formatDateString } from '../../helpers/FormatHelpers';
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
// get API Master
import { APIBisnisUnit, APIFleetType, APIOriginChild, APIPlant, APIProduct } from "../../components/api/APIMaster";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const UjtDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef(null);

    let emptyModel = {
        id: 0,
        effective_date: formatDateString(new Date()),
        expired_date: null,
        sales_type_id: { id: 0 },
        plant_id_before: { id: 0 },
        origin_id: { id: 0 },
        plant_id: { id: 0 },
        product_id: { id: 0 },
        fleet_type_id: { id: 0 },
        distance: 0,
        fuel: 0,
        toll: 0,
        meal_allowance: 0,
        loading_allowance: 0,
        additional: 0,
        ujt: 0,
        absent: 0,
        ritase: 0,
        total_cost: 0,
    };

    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [companyData, setCompanyData] = useState([]);
    const [companySelect, setCompanySelect] = useState(null);
    const [plantidbeforeSelect, setPlantIdBeforeSelect] = useState(null);
    const [originData, setOriginData] = useState(null);
    const [originSelect, setOriginSelect] = useState(null);
    const [plantData, setPlantData] = useState(null);
    const [plantSelect, setPlantSelect] = useState(null);
    const [productData, setProductData] = useState(null);
    const [productSelect, setProductSelect] = useState(null);
    const [fleetTypeData, setFleetTypeData] = useState(null);
    const [fleetTypeSelect, setFleetTypeSelect] = useState(null);

    const [statusNew, setStatusNew] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);

    useEffect(() => {
        setVisible(false);
        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const getCompany = async (keyword) => {
        const res = await APIBisnisUnit(keyword);
        setCompanyData(null);
        return res;
    }

    const getOrigin = async (keyword) => {
        const res = await APIOriginChild(keyword);
        setOriginData(null);
        return res;
    }

    const getPlant = async (keyword) => {
        const res = await APIPlant(keyword);
        setPlantData(null);
        return res;
    }

    const getProduct = async (keyword) => {
        const res = await APIProduct(keyword);
        setProductData(null);
        return res;
    }

    const getFleetType = async (keyword) => {
        if (companySelect) {
            const res = await APIFleetType(companySelect.id, keyword);
            setFleetTypeData(null);
            return res;
        }
    }

    const onChangeCompany = (e) => {
        if (companySelect) {
            if (companySelect.id === e.value.id) {
            } else {
                setFleetTypeData(null);
                setFleetTypeSelect(null);
            }
        }

        setCompanySelect(e.value);
        setChangeStatus(true);
    }

    const QueryData = async () => {
        if (id) {
            const res = await HeaderService.GetByID(id);

            if (res.status === 200) {
                const querydata = res.data;

                setValues(querydata);

                setCompanySelect(querydata.sales_type_id);
                setProductSelect(querydata.product_id);
                setOriginSelect(querydata.origin_id);
                setPlantSelect(querydata.plant_id);
                setFleetTypeSelect(querydata.fleet_type_id);
                setPlantIdBeforeSelect(querydata.plant_id_before);

                setStatusNew(false);
            } else {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data tidak ditemukan", life: 3000 });
            }
        } else {
            setStatusNew(true);
        }

        setCompanyData(null);
        setFleetTypeData(null);
        setOriginData(null);
        setPlantData(null);
        setProductData(null);
    }

    // jika tidak validasi table
    const actionFinal = (data_id, message) => {
        // jika  validasi table
        // const actionFinal = (count, data_id, message) => {
        setTimeout(() => {
            setWaiting(false);

            setChangeStatus(false);
            setVisible(false);

            toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });

            if (statusNew === false) {
                QueryData();
            } else {
                history.push({
                    pathname: "/ujt/edit/" + data_id,
                    state: {}
                });
            }
        }, 1000);
    }

    const setDataAutoComplete = () => {
        if (companySelect) {
            values.sales_type_id.id = companySelect.id;
        }

        if (plantidbeforeSelect) {
            values.plant_id_before.id = plantidbeforeSelect.id;
        }

        if (originSelect) {
            values.origin_id.id = originSelect.id;
        }

        if (plantSelect) {
            values.plant_id.id = plantSelect.id;
        }

        if (productSelect) {
            values.product_id.id = productSelect.id;
        }

        if (fleetTypeSelect) {
            values.fleet_type_id.id = fleetTypeSelect.id;
        }

        if (values.expired_date === "1970-01-01" || values.expired_date === null) {
            values.expired_date = "";
        } else {
            let effective = new Date(values.effective_date);
            let expired = new Date(values.expired_date);
            if (effective > expired) {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: "Tgl berakhir harus lebih besar dari tgl efektif", life: 3000 });
                return false;
            }
        }

        return true;
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = null;
        let result = null;

        const res = setDataAutoComplete();

        if (!res) return;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            let valueData = "";
            if (values.hasOwnProperty(key)) {
                if (values[key] === null ) {
                    valueData = "";
                } else {
                    if (key.includes("date")) {
                        if (!statusNew && values[key] !== "") {
                            valueData = formatDateString(new Date(values[key]));
                        } else {
                            valueData = values[key];
                        }
                    } else {
                        valueData = values[key];
                    }
                }
            }

            if (valueData.hasOwnProperty('id')) {
                form.append(key, valueData.id);
            } else {
                form.append(key, valueData);
            }

            return key;
        });

        // console.log([...form])

        if (values.id > 0) {
            result = await HeaderService.PutData(values.id, form);
        } else {
            result = await HeaderService.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id > 0) {
                data_id = id
            } else {
                data_id = result.data.id;
            }

            actionFinal(data_id, result.message);
            setWaiting(false);
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });
            setWaiting(false);

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401) {
            setWaiting(false);

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        } else if (result.status === 402) {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }
    };

    const { values, errors, touched, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const backURL = () => {
        return history.push({
            pathname: "/ujt/list",
        });
    }

    const backDialog = () => {
        setDataAutoComplete();

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
                    window.location.reload();
                } else {
                    history.push({
                        pathname: "/ujt/create",
                        state: {},
                    });
                    window.location.reload();
                }
                break;
            default:
                break;
        }
    }

    const calcUJT = () => {
        setChangeStatus(true)

        values.ujt = values.fuel + values.toll + values.meal_allowance + values.loading_allowance + values.additional;
        values.total_cost = values.ujt + values.absent + values.ritase;
    }

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
                            <div className="col-12 ">
                                {/* <div className="card"> */}
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                    <Panel header="Input UJT" className="h-full mb-2">
                                        <div className="p-fluid">
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="sales_type_id" title="Bisnis Unit" showField="name" errors={errors} touched={touched} models={companyData}
                                                    queryData={(e) => getCompany(e)} value={companySelect} setSelectValue={(e) => setCompanySelect(e)} onChange={(e) => { onChangeCompany(e) }} />
                                            </div>
                                            <div className="grid">
                                                <DatePickerComp className="field col-12 md:col-2" validate={true} field="effective_date" title="Tgl Efektif" value={values.effective_date} onChange={(e) => { values.effective_date = e; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <DatePickerComp className="field col-12 md:col-2" validate={true} field="expired_date" title="Tgl Berakhir" value={values.expired_date} onChange={(e) => { values.expired_date = e; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            </div>
                                            <div className="grid">
                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id_before" title="Drop Point" showField="name" errors={errors} touched={touched} models={plantData}
                                                    queryData={(e) => getOrigin(e)} value={plantidbeforeSelect} setSelectValue={(e) => setPlantIdBeforeSelect(e)} onChange={(e) => { setPlantIdBeforeSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="origin_id" title="Asal" showField="name" errors={errors} touched={touched} models={originData}
                                                    queryData={(e) => getOrigin(e)} value={originSelect} setSelectValue={(e) => setOriginSelect(e)} onChange={(e) => { setOriginSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="plant_id" title="Tujuan" showField="full_name" errors={errors} touched={touched} models={plantData}
                                                    queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => setPlantSelect(e)} onChange={(e) => { setPlantSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="fleet_type_id" title="Jenis Truck" showField="name" errors={errors} touched={touched} models={fleetTypeData}
                                                    queryData={(e) => getFleetType(e)} value={fleetTypeSelect} setSelectValue={(e) => setFleetTypeSelect(e)} onChange={(e) => { setFleetTypeSelect(e.value); setChangeStatus(true) }} />

                                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="product_id" title="Produk" showField="name" errors={errors} touched={touched} models={productData}
                                                    queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => setProductSelect(e)} onChange={(e) => { setProductSelect(e.value); setChangeStatus(true) }} />
                                            </div>
                                            <div className="grid">
                                                <InputNumberComp className="field col-12 md:col-2" field="distance" title="Jarak" value={values.distance} onChange={(e) => { values.distance = e.value; }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="fuel" title="Solar" value={values.fuel} onChange={(e) => { values.fuel = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="toll" title="Tol" value={values.toll} onChange={(e) => { values.toll = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="meal_allowance" title="Uang Makan" value={values.meal_allowance} onChange={(e) => { values.meal_allowance = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="loading_allowance" title="Bongkar Muat" value={values.loading_allowance} onChange={(e) => { values.loading_allowance = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="additional" title="Additional" value={values.additional} onChange={(e) => { values.additional = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            </div>
                                            <div className="grid">
                                                <InputNumberComp className="field col-12 md:col-2" field="absent" title="Uang Hadir" value={values.absent} onChange={(e) => { values.absent = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="ritase" title="Ritase" value={values.ritase} onChange={(e) => { values.ritase = e.value; calcUJT(); }} onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="ujt" title="Ujt" value={values.ujt} disabled onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                                <InputNumberComp className="field col-12 md:col-2" field="total_cost" title="Total" value={values.total_cost} disabled onBlur={handleBlur} onInput={() => setChangeStatus(true)} errors={errors} touched={touched} />
                                            </div>
                                        </div>
                                    </Panel>
                                    </form>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>

                    <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
                </div>
            </div>
        </Fragment>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(UjtDetail, comparisonFn);
