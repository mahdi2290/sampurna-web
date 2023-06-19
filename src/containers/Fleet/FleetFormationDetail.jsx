import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';

import { GlobalConsumer } from "../../config/Context";

import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import MenubarComp from "../../components/standard/Menu/MenubarComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";

import * as CrudHeader from '../../service/Fleet/FleetFormationService';
import * as CrudDetail from '../../service/Fleet/FleetFormationDetailService';
import * as SalesTypeMaster from '../../service/Sales/SalesType';
import * as FormationMaster from '../../service/Fleet/FormationService';
import FleetFormationEntry from "./FleetFormationEntry";
import { formatDateString } from "../../helpers/FormatHelpers";

import { APIEmployeeAll } from "../../components/api/APIMaster";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const FleetFormationDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();   

    let emptyDetailModel = {        
        id: 0,
        reference_id: 0,
        counter: "A",
        fleet_id: { id: 0, plate_no: "", company_id: {id:0}, fleet_type_id: {id:0, name:""} },
        fleet_status: 1,
        driver_id: { id: 0, name: "" },
        driver_location: "",
        driver_status: 1,
        back_up_id: { id: 0, name: "" },
        back_up_location: "",
        back_up_status: 0,
    }

    const [waiting, setWaiting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [changeStatus, setChangeStatus] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [errorList, setErrorList] = useState(false);
    const toast = useRef();

    const [salesTypeData, setSalesTypeData] = useState([]);
    const [salesTypeSelect, setSalesTypeSelect] = useState(null);
    const [employeeData, setEmployeeData] = useState([]);
    const [coordinatorSelect, setCoordinatorSelect] = useState([]);
    const [formationData, setFormationData] = useState([]);
    const [formationSelect, setFormationSelect] = useState(null);

    const [storeList, setStoreList] = useState([]);
    const [storePost, setStorePost] = useState([]);
    const [storePut, setStorePut] = useState([]);
    const [storeDelete, setStoreDelete] = useState([]);

    let emptyModel = {
        id: 0,
        reference_no: "",
        issue_date: formatDateString(new Date()),
        expired_date: null,
        sales_type_id: { id: 0 },
        formation_id: { id: 0 },
        coor_id: { id: 0 },
    };

    const getSalesType = async (keyword) => {
        const res = await SalesTypeMaster.GetList(keyword);

        setSalesTypeData(null);

        return res.data;
    }

    const getEmployee = async (keyword) => {
        const res = await APIEmployeeAll(keyword);

        setEmployeeData(null);

        return res;
    }

    const getFormation = async (keyword) => {
        if (salesTypeSelect) {
            const res = await FormationMaster.GetList(salesTypeSelect.id, keyword);

            setFormationData(null);

            return res.data;
        }

        return null;
    }

    const QueryData = async () => {
        if (id) {
            const res = await CrudHeader.GetByID(id);

            const data = res.data;

            setValues(data);

            setStoreList(data.lists);

            setSalesTypeSelect(data.sales_type_id);
            setFormationSelect(data.formation_id);
            setCoordinatorSelect(data.coor_id);
        
            setStatusNew(false);
        } else {
            setStatusNew(true);            
        }
        
        setSalesTypeData(null);
        setEmployeeData(null);
        setFormationData(null);
    }

    useEffect(() => {
        QueryData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const backURL = () => {        
        return history.push({
            pathname: "/fleet-formation/list",
        });
    }

    const backDialog = () => {
        if (changeStatus === false) {
            backURL();
        } else {
            setVisible(true);
        }
    };

    const actionNew = () => {
        return history.push({            
            pathname:  "/fleet-formation/create",
            state: {} 
        });
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "new":
                actionNew();
                break;

            case "save":
                handleSubmit();
                break;
        
            default:
                break;
        }
    };

    const onSetModels = (e) => {
        setStoreList(e);
    };

    const pushDataDetail = async(data_id) => {
        let error = parseInt(0);

        for (let index = 0; index < storePost.length; index++) {
            const row = storePost[index];   
            let status = false;

            let form = new FormData();
            Object.keys(row).map(key => {
                if (key === "reference_id") {
                    form.append(key, data_id);
                } else {
                    form.append(key, row[key]);
                }
                
                return form;
            });

            let result = await CrudDetail.PostData(form);

            if (result.status === 200) {
                props.dispatch({ type: "error-false" });
            } else if (result.status === 400) {
                status = props.dispatch({ type: "error-true" });
                setErrorList(row.id);

                result.message.map((det) => {
                    const field = det.field;
                    const value = det.message;

                    const pesan = field + " " + value;

                    toast.current.show({ severity: "error", summary: "Error!!!", detail: pesan, life: 3000 });
                    return det;
                });
            } else if (result.status === 401) {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
                status = true;
            }

            if (status === true) {
                error = error + 1;
            }
        }

        for (let index = 0; index < storePut.length; index++) {
            const row = storePut[index];
            let status = false;

            let form = new FormData();
            Object.keys(row).map(key => {
                form.append(key, row[key]);
                
                return form;
            });

            let result = await CrudDetail.PutData(data_id, form);

            if (result.status === 200) {
                props.dispatch({ type: "error-false" });
            } else if (result.status === 400) {
                status = props.dispatch({ type: "error-true" });
                setErrorList(row.id);

                result.message.map((det) => {
                    const field = det.field;
                    const value = det.message;

                    const pesan = field + " " + value;

                    toast.current.show({ severity: "error", summary: "Error!!!", detail: pesan, life: 3000 });
                    return det;
                });
            } else if (result.status === 401) {
                toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
                status = true;
            } else if (result.status === 402) {
                setWaiting(false);
                setErrorVisible(true);
                setErrorMessage(result.message);
            } else {            
                setWaiting(false);
                setErrorVisible(true);
                setErrorMessage(result.message);
            }

            if (status === true) {
                error = error + 1;
            }
        }

        for (let index = 0; index < storeDelete.length; index++) {
            const row = storeDelete[index];
            let detail_id = row.id.toString();

            await CrudDetail.DeleteData(detail_id);
        }
        return error;
    }

    const actionFinal = (count, data_id, message) => {
        if (count === 0) {
            setTimeout(() => {
                setWaiting(false);

                setStoreList([]);
                setStorePost([]);
                setStorePut([]);
                setStoreDelete([]);
                setChangeStatus(false);
                setVisible(false);

                toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });

                if (statusNew === false) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/fleet-formation/edit/" + data_id,
                        state: {}
                    });
                }
            }, 1000);
        } else {
            setWaiting(false);
        }
    }
 
    const onSubmited = async (values, actions) => {
        setWaiting(true);

        if (storePost.length === 0 && statusNew) {
            setWaiting(false);
            toast.current.show({ severity: "error", summary: "Error!!!", detail: "Silakan input data fleet terlebih dahulu.", life: 3000 });
            return;
        }
        
        // validasi untuk table PIC
        setErrorList([]);

        let form = null;
        let result = null;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            if (values.hasOwnProperty(key)) {
                const valueData = values[key];

                if (valueData === null) {
                    form.append(key, "");
                } else if (valueData.hasOwnProperty('id')) {
                    form.append(key, valueData.id);
                } else {
                    if (key.includes("date")) {
                        if (valueData === null) {
                            form.append(key, "");
                        } else {
                            form.append(key, formatDateString(new Date(valueData)));
                        }
                    } else {
                        form.append(key, valueData);
                    }
                }
            } else {
                form.append(key, "");
            }

            return key;
        });

        if (values.id > 0) {
            result = await CrudHeader.PutData(values.id, form);
        } else {
            result = await CrudHeader.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id;
            } else {
                data_id = result.data.id;
            }

            let errorCount = parseInt(0);

            errorCount = await pushDataDetail(data_id);

            actionFinal(errorCount, data_id, result.message);
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
        }
    }

    const { values, errors, touched, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited
    });

    const findIndexList = (id) => {
        let index = -1;
        for (let i = 0; i < storeList.length; i++) {
            if (storeList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexPost = (id) => {
        let index = -1;
        for (let i = 0; i < storePost.length; i++) {
            if (storePost[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onPushData = (method, data) => {        
        let index;

        let storeModel = {
            id: data.id,
            reference_id: id,
            counter: data.counter,
            fleet_id: data.fleet_id.id,
            fleet_status: data.fleet_status,
            driver_id: data.driver_id.id,
            driver_location: data.driver_location,
            driver_status: data.driver_status,
            back_up_id: data.back_up_id.id,
            back_up_location: data.back_up_location,
            back_up_status: data.back_up_status,
        };
        
        switch (method) {
            case "C":
                setStorePost(prevState => [...prevState, storeModel]);
                break;
            case "U":
                if (!isNaN(data.id)) {
                    let _before = [...storeList];
                    index = findIndexList(storeModel.id);

                    _before[index] = storeModel;
                    setStorePut(prevState => [...prevState, storeModel]);
                } else {
                    let _before = [...storePost];
                    index = findIndexPost(storeModel.id);

                    if (index >= 0) {
                        _before[index] = storeModel;
                        setStorePost(_before);
                    }
                }
                break;
            case "D":
                if (!isNaN(storeModel.id)) {
                    setStoreDelete(prevState => [...prevState, storeModel]);
                }

                if (storePost) {
                    let _post = storePost.filter(val => val.id !== storeModel.id);
                    setStorePost(_post);
                }

                if (storePut) {
                    let _put = storePut.filter(val => val.id !== storeModel.id);
                    setStorePut(_put);
                }
                break;
            default:
                break;
        }        
    }

    const findIndexError = (id) => {
        let index = -1;
        for (let i = 0; i < errorList.length; i++) {
            if (errorList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const rowClassNameTemplate = (data) => {
        const index = findIndexError(data.id);
        
        return {
            'd-error': index > -1
        }
    }

    return (
        <div className="card">
            <div className="grid crud-demo">
                <div className="col-12">
                    <Toast ref={toast} />
                    <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
                </div>
                <div className="col-12">
                    <Panel header="Input" className="h-full mt-3 mb-3">
                        <div className="p-fluid">
                            <div className="grid">
                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="sales_type_id" title="Bisnis Unit" showField="name"  errors={errors} touched={touched} models={salesTypeData}
                                    queryData={(e) => getSalesType(e)} value={salesTypeSelect} setSelectValue={(e) => setSalesTypeSelect(e)} onChange={(e) => { setSalesTypeSelect(e.value); values.sales_type_id = e.value; setFormationData(null); setFormationSelect(null); setChangeStatus(true) }} />
                                <DatePickerComp className="field col-12 md:col-4" validate={true} field="issue_date" title="Tgl Dibuat" value={values.issue_date} onChange={(e) => { values.issue_date = e; setChangeStatus(true) }} onBlur={handleBlur} errors={errors} touched={touched} />
                                <DatePickerComp className="field col-12 md:col-4" validate={true} field="expired_date" title="Tgl Expired" value={values.expired_date} onChange={(e) => { values.expired_date = e; setChangeStatus(true) }} onBlur={handleBlur} errors={errors} touched={touched} />                                
                            </div>
                            <div className="grid">                                
                                <InputTextComp className="field col-12 md:col-4" validate={false} field="reference_no" title="No. Formasi" disabled={true} value={values.reference_no} onChange={() => setChangeStatus(true)} onBlur={handleBlur} onInput={() => setChangeStatus(true)} />
                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="formation_id" title="Formasi" showField="name"  errors={errors} touched={touched} models={formationData}
                                    queryData={(e) => getFormation(e)} value={formationSelect} setSelectValue={(e) => setFormationSelect(e)} onChange={(e) => { setFormationSelect(e.value); values.formation_id = e.value; setChangeStatus(true) }} />
                                <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="coor_id" title="Staf Transport" showField="name"  errors={errors} touched={touched} models={employeeData}
                                    queryData={(e) => getEmployee(e)} value={coordinatorSelect} setSelectValue={(e) => setCoordinatorSelect(e)} onChange={(e) => { setCoordinatorSelect(e.value); values.coor_id = e.value; setChangeStatus(true) }} />                            
                            </div>
                        </div>
                    </Panel>
                </div>
                <div className="col-12">
                    <Panel header="Fleet">
                        <FleetFormationEntry id={id} models={storeList} onPushData={onPushData} setModels={onSetModels} empty={emptyDetailModel} rowClassName={(e) => rowClassNameTemplate(e)} onSetChangeStatus={() => setChangeStatus(true)} toast={toast} salesTypeSelect={salesTypeSelect} />
                    </Panel>
                </div>
            </div>

            <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(FleetFormationDetail), comparisonFn);