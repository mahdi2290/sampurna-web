import React, { Fragment, useState, useEffect, useRef } from 'react'
import * as CrudHeader from '../../service/Fleet/FleetFormationService';
import * as CrudDetail from '../../service/Fleet/FleetFormationDetailService';
import * as SalesTypeMaster from '../../service/Sales/SalesType';
import { PickList } from 'primereact/picklist';
import { Toast } from 'primereact/toast';
import MenubarComp from '../../components/standard/Menu/MenubarComp';
import { Panel } from 'primereact/panel';
import AutoCompleteComp from '../../components/standard/Form/AutoCompleteComp';
import DatePickerComp from '../../components/standard/Form/DatePickerComp';
import InputTextComp from '../../components/standard/Form/InputTextComp';
import { useHistory, useParams } from 'react-router-dom';
import { APIEmployeeAll, APIFleetType } from '../../components/api/APIMaster';
import * as FormationMaster from '../../service/Fleet/FormationService';
import { formatDateString } from '../../helpers/FormatHelpers';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import * as EmployeeMaster from '../../service/Employee/EmployeeService';
import InputDialogComp from '../../components/standard/Dialog/InputDialogComp';
import PostPutValidationComp from '../../components/standard/Validation/PostPutValidationComp';
import { GlobalConsumer } from '../../config/Context';
import InputSwitchComp from '../../components/standard/Form/InputSwitchComp';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { createFormationExcel } from '../Excel/formation_excel';

const FleetFormationModify = (props) => {
    const { id } = useParams();
    const today = new Date();
    const history = useHistory();
    const [availableModels, setAvailableModels] = useState([]);
    const [targetModels, setTargetModels] = useState([]);
    const [models, setModels] = useState([]);
    const [fleetStatus, setFleetStatus] = useState(false);
    const [method, setMethod] = useState(false);

    const employeeModel = {
        nik: "",
        license_no: "",
        license_type: "",
        license_exp_date: "",
        join_date: "",
        bank_no: "",
        phone: "",
    }

    const fleetModel = {
        reference_id: 0,
        id: 0,
        fleet_id: 0,
        plate_no: "",
        fleet_type_id: 0,
        fleet_type_name: "",
        driver_id: 0,
        driver_name: "",
        counter: "A",
        fleet_status: 1,
        driver_status: 1,
        back_up_id: 0,
        back_up_name: "",
        back_up_status: 0,
        crud: 'N',
    }

    const [waiting, setWaiting] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [changeUpdate, setChangeUpdate] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [visible, setVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorList, setErrorList] = useState(false);
    const toast = useRef();
    const issueDateRef = useRef();
    const businessRef = useRef(0);
    const fleetTypeRef = useRef();
    const methodRef = useRef(0);
    const formationRef = useRef();

    const [salesTypeData, setSalesTypeData] = useState([]);
    const [salesTypeSelect, setSalesTypeSelect] = useState(null);
    const [employeeData, setEmployeeData] = useState([]);
    const [coordinatorSelect, setCoordinatorSelect] = useState([]);
    const [formationData, setFormationData] = useState([]);
    const [formationSelect, setFormationSelect] = useState(null);
    const [employeeDriver, setEmployeeDriver] = useState(employeeModel);
    const [driverSelect, setDriverSelect] = useState([]);
    const [driverDays, setDriverDays] = useState(0);
    const [employeeKenek, setEmployeeKenek] = useState(employeeModel);
    const [kenekSelect, setKenekSelect] = useState([]);
    const [kenekDays, setKenekDays] = useState(0);
    const [model, setModel] = useState(fleetModel);

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

    const getFormation = async (keyword) => {
        if (salesTypeSelect) {
            const res = await FormationMaster.GetList(salesTypeSelect.id, keyword);

            setFormationData(null);

            return res.data;
        }

        return null;
    }

    const getEmployee = async (keyword) => {
        const res = await APIEmployeeAll({keyword: keyword});

        setEmployeeData(null);

        return res;
    }

    const getEmployeeDriver = async (id) => {
        if (id) {
            const res = await EmployeeMaster.GetByID(id);

            if (res.status === 200) {
                if (res.data.join_date !== null) {
                    let Difference_In_Time = today.getTime() - new Date(res.data.join_date).getTime();
                    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                    setDriverDays(Difference_In_Days.toFixed(0));
                } else {
                    setDriverDays(0);
                }

                const employeeModel = {
                    nik: res.data.nik,
                    license_no: res.data.license_no,
                    license_type: res.data.license_type,
                    license_exp_date: res.data.license_exp_date === null ? "" : res.data.license_exp_date,
                    join_date: res.data.join_date === null ? "" : res.data.join_date,
                    bank_no: res.data.bank_no,
                    phone: res.data.phone,
                }

                setEmployeeDriver(employeeModel);
            }
        }
    }

    const getEmployeeKenek = async (id) => {
        if (id) {
            const res = await EmployeeMaster.GetByID(id);

            if (res.status === 200) {
                if (res.data.join_date !== null) {
                    let Difference_In_Time = today.getTime() - new Date(res.data.join_date).getTime();
                    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                    setKenekDays(Difference_In_Days.toFixed(0));
                } else {
                    setDriverDays(0);
                }

                const employeeModel = {
                    nik: res.data.nik,
                    license_no: res.data.license_no,
                    license_type: res.data.license_type,
                    license_exp_date: res.data.license_exp_date === null ? "" : res.data.license_exp_date,
                    join_date: res.data.join_date === null ? "" : res.data.join_date,
                    bank_no: res.data.bank_no,
                    phone: res.data.phone,
                }

                setEmployeeKenek(employeeModel);
            }
        }
    }

    const onChangePickList = (event) => {
        setAvailableModels(event.source);
        setTargetModels(event.target);
    }

    const sourceItemTemplate = (item) => {
        return (
            <div className="flex align-items-center w-full">
                <div className="flex-1">
                    <div className="flex flex-row align-items-center justify-content-between">
                        <div className="text-2xl"><b>{item.plate_no}</b> - {item.formation_name}</div>
                        <div className="text-1xl">{item.fleet_type_name}</div>
                    </div>
                    <div className="flex flex-row align-items-center justify-content-between">
                        <div className="text-1xl">{item.driver_name === "" ? "\u00a0" : item.driver_name }</div>
                        <div className="text-1xl">{item.back_up_name === "" ? "\u00a0" : item.back_up_name }</div>
                    </div>
                </div>
            </div>
        );
    }

    const actionEdit = (data) => {
        if (data.length > 0) {
            const item = data[0];

            setModel(item);
            setFleetStatus(item.fleet_status === 1 ? true : false);
            getEmployeeDriver(item.driver_id);
            getEmployeeKenek(item.back_up_id);
            setDriverSelect({id: item.driver_id, name: item.driver_name});
            setKenekSelect({id: item.back_up_id, name: item.back_up_name});
            setEmployeeDriver(employeeModel);
            setDriverDays(0);
            setEmployeeKenek(employeeModel);
            setKenekDays(0);
            setVisibleDialog(true);
        }
    }

    const targetItemTemplate = (item) => {
        return (
            <div className="flex align-items-center w-full">
                <div className="flex-1">
                    <div className="flex flex-row align-items-center justify-content-between">
                        <div className="text-2xl"><b>{item.plate_no}</b></div>
                        <div className="text-1xl">{item.fleet_type_name}</div>
                    </div>
                    <div className="flex flex-row align-items-center justify-content-between">
                        <div className="text-1xl">{item.driver_name === "" ? "\u00a0" : item.driver_name }</div>
                        <div className="text-1xl">{item.back_up_name === "" ? "\u00a0" : item.back_up_name }</div>
                    </div>
                </div>
            </div>
        );
    }

    const QueryData = async() => {
        await getTargetData();
        await getSourceData();
    }

    const getTargetData = async () => {
        setWaiting(true);

        let formation_id = 0;
        if (id) {
            formation_id = id;
            setStatusNew(false);
        } else {
            setStatusNew(true);
        }

        if (formation_id > 0) {
            const resultTarget = await CrudHeader.GetByID(formation_id);

            setTargetModels([]);
            if (resultTarget.status === 200) {
                const data = resultTarget.data;
                businessRef.current = data.sales_type_id.id;
                formationRef.current = data.formation_id.id;

                setValues(data);
                setModels(data);

                setSalesTypeSelect(data.sales_type_id);
                setFormationSelect(data.formation_id);
                setCoordinatorSelect(data.coor_id);
                const listTarget = data.lists;

                if (listTarget !== null) {
                    const dataTarget = [];
                    for (let index = 0; index < listTarget.length; index++) {
                        const row = listTarget[index];
                        const fleet = row.fleet_id;

                        dataTarget.push({
                            reference_id: 0,
                            id: row.id,
                            fleet_id: fleet.id,
                            plate_no: fleet.plate_no,
                            fleet_type_id: fleet.fleet_type_id.id,
                            fleet_type_name: fleet.fleet_type_id.name,
                            driver_id: row.driver_id.id,
                            driver_name: row.driver_id.name,
                            counter: row.counter,
                            fleet_status: 1,
                            driver_status: 1,
                            back_up_id: row.back_up_id !== null ? row.back_up_id.id : 0,
                            back_up_name: row.back_up_id !== null ? row.back_up_id.name : "",
                            back_up_status: 0,
                            formation_name: "",
                            crud: 'A'
                        })
                    }
                    setTargetModels(dataTarget);
                }
            }
        }

        setWaiting(false);
    }

    const getSourceData = async() => {
        setWaiting(true);
        let business_id = businessRef.current;
        const params = {
            issue_date: issueDateRef.current,
            method: methodRef.current,
        }

        if (business_id > 0) {
            const resultSource = await CrudHeader.GetAvailableVehicle(business_id, params);
            setAvailableModels([])

            if (resultSource.status === 200) {
                const listSource = resultSource.data;
                if (listSource) {
                    let dataSource = [];
                    for (let index = 0; index < listSource.length; index++) {
                        const row = listSource[index];

                        dataSource.push({
                            reference_id: 0,
                            id: 0,
                            fleet_id: row.id,
                            plate_no: row.plate_no,
                            fleet_type_id: row.fleet_type_id,
                            fleet_type_name: row.fleet_type_name,
                            driver_id: row.driver_id === null ? 0 : row.driver_id,
                            driver_name: row.driver_name === null ? "" : row.driver_name,
                            counter: "",
                            fleet_status: 1,
                            driver_status: 1,
                            back_up_id: row.back_up_id === null ? 0 : row.back_up_id,
                            back_up_name: row.back_up_name === null ? "" : row.back_up_name,
                            back_up_status: 0,
                            formation_name: row.master_formation_name === null ? "" : row.master_formation_name,
                            crud: 'N'
                        })
                    }
                    setAvailableModels(dataSource);
                }
            }
        }

        setWaiting(false);
    }

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
        history.push({
            pathname:  "/fleet-formation/create",
            state: {}
        });
        window.location.reload();
    }

    const pushDataDetail = async(data_id) => {
        let error = parseInt(0);

        const postList = targetModels.filter(val => val.crud === "S");
        const putList = targetModels.filter(val => val.crud === "U");
        const deleteList = availableModels.filter(val => val.crud !== "N");

        for (let index = 0; index < postList.length; index++) {
            const row = postList[index];

            const fleet = targetModels.filter(val => val.fleet_id === row.fleet_id && val.id !== row.id);
            const driver = targetModels.filter(val => val.driver_id === row.driver_id && val.id !== row.id);
            // console.log(fleet.length, driver.length, postList);
            if (fleet.length === 0 && driver.length === 0) {
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
        }

        for (let index = 0; index < putList.length; index++) {
            const row = putList[index];
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

            // console.log([...form])

            let result = await CrudDetail.PutData(row.id, form);

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

        for (let index = 0; index < deleteList.length; index++) {
            const row = deleteList[index];
            let detail_id = row.id.toString();

            await CrudDetail.DeleteData(detail_id);
        }
        return error;
    }

    const actionFinal = (count, data_id, message) => {
        if (count === 0) {
            setTimeout(() => {
                setWaiting(false);

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

        if (targetModels.length === 0 && statusNew) {
            setWaiting(false);
            toast.current.show({ severity: "error", summary: "Error!!!", detail: "Silakan input data fleet terlebih dahulu.", life: 3000 });
            return;
        }

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

        // console.log([...form]);

        if (id > 0) {
            result = await CrudHeader.PutData(id, form);
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

            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
            setWaiting(false);
        } else if (result.status === 401) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
            setWaiting(false);
        }

        setWaiting(false);
    }

    const { values, errors, touched, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited
    });

    const onChangeBisnis = (e) => {
        setSalesTypeSelect(e);
        businessRef.current = e.id;
        values.sales_type_id = e;
        setFormationData(null);
        setFormationSelect(null);
        setChangeStatus(true);
        getSourceData();
    }

    const onChangeBisnisValue = (e) => {
        setSalesTypeSelect(e);
        businessRef.current = e.id;
        values.sales_type_id = e;
        setFormationData(null);
        setFormationSelect(null);
        setChangeStatus(true);
        getSourceData();
    }

    const onChangeFormation = (e) => {
        setFormationSelect(e);
        values.formation_id = e;
        setChangeStatus(true)
    }

    const onChangeFormationValue = (e) => {
        setFormationSelect(e);
        values.formation_id = e;
        setChangeStatus(true)
    }

    const onChangeCoordinator = (e) => {
        setCoordinatorSelect(e);
        values.coor_id = e;
        setChangeStatus(true)
    }

    const onChangeCoordinatorValue = (e) => {
        setCoordinatorSelect(e);
        values.coor_id = e;
        setChangeStatus(true)
    }

    const findTarget = (id) => {
        let index = -1;
        for (let i = 0; i < targetModels.length; i++) {
            if (targetModels[i].fleet_id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const actionSave = () => {
        let _models = [...targetModels];
        let _model = { ...model };

        const index = findTarget(_model.fleet_id);

        if (changeUpdate) {
            if (_model.crud === "A") {
                _models[index].crud = "U";
            }
            if (_model.crud === "N") {
                _models[index].crud = "S";
            }

            _models[index].counter = _model.counter;
            _models[index].driver_id = _model.driver ? _model.driver.id : _models[index].driver_id;
            _models[index].driver_name = _model.driver ? _model.driver.name : _models[index].driver_name;

            _models[index].back_up_id = _model.back_up ? _model.back_up.id : _models[index].back_up_id;
            _models[index].back_up_name = _model.back_up ? _model.back_up.name : _models[index].back_up_name;

            setTargetModels(_models);

            setModel(fleetModel);
        }
        setVisibleDialog(false);
        setChangeUpdate(false)
    }

    const changeBatang = (e) => {
        setDriverSelect(e);
        if (e){
            getEmployeeDriver(e.id);
        }
        model.driver = e;
        setChangeUpdate(true);
    }

    const changeKenek = (e) => {
        setKenekSelect(e);
        if (e){
            getEmployeeKenek(e.id);
        }
        model.back_up = e;
        setChangeUpdate(true);
    }

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap justify-content-left card-container blue-container">
                <div className="text-black flex align-items-left justify-content-left">
                    {item.nik} - {item.name}
                </div>
            </div>
        );
    };

    const dynamicForm = (
        <Fragment>
            <div className="p-fluid">
                <Panel header="Fleet" className="mb-3">
                    <div className="grid">
                        <InputTextComp className="field col-12 md:col-2" validate={false} field="fleet_id" title="No Polisi" disabled={true} value={model.plate_no}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="fleet_type_id" title="Jenis Kendaraan" disabled={true} value={model.fleet_type_name}/>

                        <InputSwitchComp className="field col-12 md:col-2" validate={false} field="fleet_status" title="Status" checked={fleetStatus} onChange={(e) => { setFleetStatus(e.value); model.fleet_status = e.value ? 1 : 0; setChangeUpdate(true) }} />
                    </div>
                </Panel>

                <Panel header="Batang" className="mb-3">
                    <div className="grid">
                        <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={false} field="driver_id" title="Nama Batang" showField="name" models={employeeData}
                            queryData={(e) => getEmployee(e)} value={driverSelect} itemTemplate={itemTemplate} setSelectValue={(e) => changeBatang(e)} onChange={(e) => changeBatang(e.value) } />
                        <InputTextComp className="field col-12 md:col-2" validate={false} field="driver_days" title="Lama Bekerja" disabled={true} value={driverDays}/>
                        <InputTextComp className="field col-12 md:col-3" validate={false} field="driver_phone" title="Telepon" disabled={true} value={employeeDriver.phone}/>
                        <InputTextComp className="field col-12 md:col-3" validate={false} field="driver_bank_no" title="No Rekening" disabled={true} value={employeeDriver.bank_no}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="driver_license_type" title="Jenis SIM" disabled={true} value={employeeDriver.license_type}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="driver_license_no" title="No SIM" disabled={true} value={employeeDriver.license_no}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="driver_license_exp_date" title="Tgl Expired" disabled={true} value={employeeDriver.license_exp_date}/>
                    </div>
                </Panel>

                <Panel header="Serep" className="mb-3">
                    <div className="grid">
                        <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={false} field="back_up_id" title="Nama Serep" showField="name" forceSelection={true} models={employeeData}
                            queryData={(e) => getEmployee(e)} value={kenekSelect} itemTemplate={itemTemplate} setSelectValue={(e) => changeKenek(e)} onChange={(e) => changeKenek(e.value)} />
                        <InputTextComp className="field col-12 md:col-2" validate={false} field="back_up_days" title="Lama Bekerja" disabled={true} value={kenekDays}/>
                        <InputTextComp className="field col-12 md:col-3" validate={false} field="back_up_phone" title="Telepon" disabled={true} value={employeeKenek.phone}/>
                        <InputTextComp className="field col-12 md:col-3" validate={false} field="back_up_bank_no" title="No Rekening" disabled={true} value={employeeKenek.bank_no}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="back_up_license_type" title="Jenis SIM" disabled={true} value={employeeKenek.license_type}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="back_up_license_no" title="No SIM" disabled={true} value={employeeKenek.license_no}/>
                        <InputTextComp className="field col-12 md:col-4" validate={false} field="back_up_license_exp_date" title="Tgl Expired" disabled={true} value={employeeKenek.license_exp_date}/>
                    </div>
                </Panel>
            </div>
        </Fragment>
    );

    const exportExcel = async() => {
        setWaiting(true);
        let issueDate = issueDateRef.current;
        let business = businessRef.current;
        let formation = formationRef.current;

        const params = { issue_date: formatDateString(issueDate), sales_type_id: business, formation_id: formation };

        const res = await CrudHeader.GetAllActive(params);

        if (res.status === 200) {
            if (res.data) {
                createFormationExcel(res.data.list[0]);
            }
        }
        setWaiting(false);
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

            case "download":
                exportExcel();
                break;

            default:
                break;
        }
    };

    const onChangeMethod = (e) => {
        setMethod(e);
        methodRef.current = e ? 1 : 0;

        getSourceData();
    }

    useEffect(() => {
        const formation = props.dispatch({ type: "get-data", id: 'date-formation'});

        if (formation) {
            issueDateRef.current = formatDateString(new Date(formation.data));
            emptyModel.issue_date = formatDateString(new Date(formation.data));
        } else {
            issueDateRef.current = formatDateString(new Date());
            emptyModel.issue_date = formatDateString(new Date());
        }

        businessRef.current = 0;
        fleetTypeRef.current = 0;

        QueryData();
        setSalesTypeData(null);
        setEmployeeData(null);
        setFormationData(null);

        setSalesTypeSelect(null);
        setFormationSelect(null);
        setCoordinatorSelect(null);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="card">
            <div className="grid crud-demo">
                <div className="col-12">
                    <Toast ref={toast} />
                    <MenubarComp field="toolbar-detail" action="crud-export" actionButton={(e) => actionButtonToolbar(e)} />
                </div>
                <div className="col-12">
                    <Accordion multiple activeIndex={[0, 1]}>
                        <AccordionTab header="Input">
                            <div className="p-fluid">
                                <div className="grid">
                                    <InputTextComp className="field col-12 md:col-4" validate={false} field="reference_no" title="No. Formasi" disabled={true} value={values.reference_no} onChange={() => setChangeStatus(true)} onBlur={handleBlur} onInput={() => setChangeStatus(true)} />
                                    <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="sales_type_id" title="Bisnis Unit" showField="name" errors={errors} touched={touched} models={salesTypeData}
                                        queryData={(e) => getSalesType(e)} value={salesTypeSelect} setSelectValue={(e) => onChangeBisnisValue(e)} onChange={(e) => onChangeBisnis(e.value)} />
                                    <DatePickerComp disabled={true} className="field col-12 md:col-2" validate={true} field="issue_date" title="Tgl Formasi" value={values.issue_date} onChange={(e) => { values.issue_date = e; QueryData(); setChangeStatus(true) }} onBlur={handleBlur} errors={errors} touched={touched} />
                                    {/* <DatePickerComp className="field col-12 md:col-2" validate={true} field="expired_date" title="Tgl Expired" value={values.expired_date} onChange={(e) => { values.expired_date = e; issueDateRef.current = e; setChangeStatus(true) }} onBlur={handleBlur} errors={errors} touched={touched} /> */}
                                </div>
                                <div className="grid">
                                    <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="formation_id" title="Formasi" showField="name"  errors={errors} touched={touched} models={formationData}
                                        queryData={(e) => getFormation(e)} value={formationSelect} setSelectValue={(e) => onChangeFormationValue(e)} onChange={(e) => { onChangeFormation(e.value); }} />
                                    <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={true} field="coor_id" title="Staf Transport" showField="name"  errors={errors} touched={touched} models={employeeData}
                                        queryData={(e) => getEmployee(e)} value={coordinatorSelect} setSelectValue={(e) => onChangeCoordinatorValue(e)} onChange={(e) => { onChangeCoordinator(e.value); }} />
                                </div>
                            </div>
                        </AccordionTab>
                        <AccordionTab header="Fleet">
                            <div className="grid p-fluid" style={{marginLeft:'45px'}}>
                                <InputSwitchComp className="field col-12 md:col-12" validate={false} field="method" title="Reserve" checked={method} onChange={(e) => { onChangeMethod(e.value); }} onBlur={handleBlur} />
                            </div>
                            <PickList source={availableModels} target={targetModels} sourceHeader="Available" targetHeader="Selected"
                                sourceStyle={{ height: '150rem' }} targetStyle={{ height: '150rem' }} onChange={onChangePickList} breakpoint="1400px"
                                filterBy="plate_no" sourceFilterPlaceholder="Search by plate no" targetFilterPlaceholder="Search by plate no" onTargetSelectionChange={(e) => actionEdit(e.value)}
                                sourceItemTemplate={sourceItemTemplate} targetItemTemplate={targetItemTemplate} />

                                <InputDialogComp title="Driver" style={{width: "800px"}} visible={visibleDialog} setVisible={() => { setVisibleDialog(false); setChangeUpdate(false); }} actionSave={actionSave} dynamicForm={dynamicForm} />
                        </AccordionTab>
                    </Accordion>
                </div>

                <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(GlobalConsumer(FleetFormationModify), comparisonFn);
