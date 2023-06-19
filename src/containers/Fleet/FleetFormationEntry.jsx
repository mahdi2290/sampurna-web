import React, { Fragment, useState, useEffect } from "react";
import { Panel } from 'primereact/panel';
import DataTableCrudLocalComp from "../../components/standard/DataTable/DataTableCrudLocalComp";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import InputSwitchComp from "../../components/standard/Form/InputSwitchComp";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import * as EmployeeMaster from '../../service/Employee/EmployeeService';
import { APIEmployeeCompany } from "../../components/api/APIMaster";

const FleetFormationEntry = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);
    const today = new Date();
    
    const title = "List Fleet";
    const columnsTable = [
        { field: 'counter', header: 'Loket', sortable: false, style: "percent", width: 8 },
        { field: 'fleet_id.plate_no', header: 'No Plate', sortable: false, style: "percent", width: 15 },
        { field: 'fleet_status', header: 'Fleet Status', sortable: false, style: "percent", width: 9, body: "boolean"},
        { field: 'driver_id.name', header: 'Nama Supir', sortable: false, style: "percent", width: 50 },
        { field: 'driver_status', header: 'Supir Status', sortable: false, style: "percent", width: 9, body: "boolean"},
        { field: 'action', header: '' },
    ];

    const counterList = [ 
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" },
    ];

    const employeeModel = {
        license_no: "",
        license_type: "",
        license_exp_date: "",
        join_date: "",
        bank_no: "",
        phone: "",
    }
    
    const [employeeData, setEmployeeData] = useState([]);
    const [driverSelect, setDriverSelect] = useState([]);

    const [companyID, setCompanyID] = useState(0);

    const [counterData, setCounterData] = useState();
    const [counterSelect, setCounterSelect] = useState([]);
    
    const [driverDays, setDriverDays] = useState(0);
    
    const [fleetStatus, setFleetStatus] = useState(false);
    const [driverStatus, setDriverStatus] = useState(false);
    const [employeeDriver, setEmployeeDriver] = useState(employeeModel);

    const getEmployee = (keyword) => {
        if (companyID > 0) {
            const res = APIEmployeeCompany(companyID, keyword);

            setEmployeeData(null);
    
            return res;
        }
        
        return null;
    }

    const getEmployeeDriver = async (e) => {
        if (e.id) {
            const res = await EmployeeMaster.GetByID(e.id);
    
            if (res.status === 200) {
                if (res.data.join_date !== null) {
                    let Difference_In_Time = today.getTime() - new Date(res.data.join_date).getTime();
                    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    
                    setDriverDays(Difference_In_Days.toFixed(0));
                } else {
                    setDriverDays(0);
                }
                
                const employeeModel = {
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

    const dynamicForm = (
        <Fragment>
            <form onSubmit={props.handleSubmit} autoComplete="off"> 
                <div className="p-fluid">
                    <Panel header="Fleet" className="mb-3"> 
                        <div className="grid">
                            <InputTextComp className="field col-12 md:col-2" validate={false} field="fleet_id" title="No Polisi" disabled={true} value={model.fleet_id.plate_no}/>
                            <InputTextComp className="field col-12 md:col-4" validate={false} field="fleet_type_id" title="Jenis Kendaraan" disabled={true} value={model.fleet_id.fleet_type_id.name}/>
                            <DropDownComp className="field col-12 md:col-2" validate={false} field="counter" title="Loket" optionLabel="name" optionValue="name" options={counterData} value={counterSelect} 
                                onChange={(e) => { setCounterSelect(e.value); model.counter = e.value; props.onSetChangeStatus() }} />
                            
                            <InputSwitchComp className="field col-12 md:col-2" validate={false} field="fleet_status" title="Status" checked={fleetStatus} onChange={(e) => { setFleetStatus(e.value); model.fleet_status = e.value ? 1 : 0 }} />
                        </div>
                    </Panel>
                    
                    <Panel header="Supir" className="mb-3"> 
                        <div className="grid">
                            <AutoCompleteComp className="field col-12 md:col-4" api={true} validate={false} field="driver_id" title="Nama Supir" showField="name"  models={employeeData}
                                queryData={(e) => getEmployee(e)} value={driverSelect} setSelectValue={(e) => setDriverSelect(e)} onChange={(e) => { setDriverSelect(e.value); model.driver_id = e.value; getEmployeeDriver(e.value); props.onSetChangeStatus() }} />
                            <InputTextComp className="field col-12 md:col-2" validate={false} field="driver_days" title="Lama Bekerja" disabled={true} value={driverDays}/>
                            <InputTextComp className="field col-12 md:col-3" validate={false} field="driver_phone" title="Telepon" disabled={true} value={employeeDriver.phone}/>
                            <InputTextComp className="field col-12 md:col-3" validate={false} field="driver_bank_no" title="No Rekening" disabled={true} value={employeeDriver.bank_no}/>
                            <InputTextComp className="field col-12 md:col-4" validate={false} field="driver_license_type" title="Jenis SIM" disabled={true} value={employeeDriver.license_type}/>
                            <InputTextComp className="field col-12 md:col-4" validate={false} field="driver_license_no" title="No SIM" disabled={true} value={employeeDriver.license_no}/>
                            <InputTextComp className="field col-12 md:col-4" validate={false} field="driver_license_exp_date" title="Tgl Expired" disabled={true} value={employeeDriver.license_exp_date}/>
                            <InputTextComp className="field col-12 md:col-10" validate={false} field="driver_location" title="Tempat Tinggal" value={model.driver_location} onChange={(e) => onInputChange(e)} />
                            <InputSwitchComp className="field col-12 md:col-2" validate={false} field="driver_status" title="Status" checked={driverStatus} onChange={(e) => { setDriverStatus(e.value); model.driver_status = e.value ? 1 : 0 }} />                      
                        </div>
                    </Panel>
                </div>
            </form>
        </Fragment>
    );

    const onInputChange = (e) => {
        e.preventDefault();

        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value;

        setModel(modelBefore);
    };

    useEffect(() => {
        setCounterData(counterList);
        setCounterSelect(counterList[0].name);

        setEmployeeData(null);        

        setModels(props.models);
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSetModel = (e) => {
        setModel(e);

        setCompanyID(e.fleet_id.company_id.id);
        setDriverSelect(e.driver_id);

        setFleetStatus(e.fleet_status === "1" ? true : false);
        setDriverStatus(e.driver_status === 1 ? true : false);
        
        if (e.driver_id.id > 0) {
            getEmployeeDriver(e.driver_id.id);
        }
        
        setEmployeeData(null);
    }

    const actionAdd = () => {
        setCompanyID(0);
        setDriverSelect(null);

        setFleetStatus(false);
        setDriverStatus(false);

        setEmployeeDriver(employeeModel);
        setCounterSelect(counterList[0].name);
        model.counter = counterList[0].name;
    }

    const onSetModels = (e) => {
        setModels(e);
    }

    return (
        <DataTableCrudLocalComp actionStatus="edit" multiple={true} title={title} models={models} paginator={false} toolbar={false} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} search={true}
            columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.onPushData} changeStatusValidate={props.onSetChangeStatus} actionAdd={actionAdd} doubleClick={true}
            toast={props.toast} inputValidate={false} filterField="name" rows={10} dialogStyle={{width: "1000px"}} rowClassName={props.rowClassName}/>
    );
}

export default FleetFormationEntry;