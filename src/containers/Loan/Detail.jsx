import React, { Fragment, useState, useEffect } from "react";
import DataTableCrudLocalComp from "../../components/standard/DataTable/DataTableCrudLocalComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import { APIEmployeeAll } from "../../components/api/APIMaster";

const LoanDetail = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);

    const [employeeData, setEmployeeData] = useState([]);
    const [employeeSelect, setEmployeeSelect] = useState([]);
    
    const title = "List Detail";
    const columnsTable = [
        { field: 'document_no', header: 'No Dokumen', sortable: false, style: "fix", width:{ width:'20%' } },
        { field: 'employee_id.name', header: 'Nama Karyawan', sortable: false, style: "fix", width:{ width:'28%' } },
        { field: 'amount', header: 'Jumlah', sortable: false, style: "fix", width:{ width:'20%' }, body: "currency" },
        { field: 'memo', header: 'Keterangan', sortable: false, style: "fix", width:{ width:'20%' } },
        { field: 'action', header: '' },
    ];

    const getEmployee = async (keyword) => {
        const res = await APIEmployeeAll({keyword: keyword});

        setEmployeeData(null);

        return res;
    }

    const onInputChange = (e) => {
        e.preventDefault();

        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value;

        setModel(modelBefore);
    };

    const onInputNumberChange = (e) => {
        let modelBefore = { ...model };
        modelBefore['amount'] = e.value;

        setModel(modelBefore);
    };

    const onAutoCompleteChange = (e) => {
        let modelBefore = { ...model };
        modelBefore['employee_id']['id'] = e.id;

        setModel(modelBefore);
    };

    const dynamicForm = (
            <Fragment>
                <InputTextComp className="field col-12 md:col-12" field="document_no" title="No Dokumen" value={model.document_no} onChange={(e) => onInputChange(e)} />
                <AutoCompleteComp className="field col-12 md:col-12" api={true} field="employee_id" title="Nama Karyawan" showField="name" models={employeeData}
                    queryData={(e) => getEmployee(e)} value={employeeSelect} setSelectValue={(e) => setEmployeeSelect(e)} onChange={(e) => { setEmployeeSelect(e.value); onAutoCompleteChange(e.value); }} />
                <InputNumberComp className="field col-12 md:col-12" field="amount" title="Jumlah" value={model.amount} onChange={(e) => onInputNumberChange(e)} />
                <InputTextComp className="field col-12 md:col-12" field="memo" title="Keterangan" value={model.memo} onChange={(e) => onInputChange(e)} />
        </Fragment>
    )

    useEffect(() => {
        setModels(props.models);
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSetModel = (e) => {
        setModel(e);

        setEmployeeData(null);
        if (e.employee_id.id > 0) {
            setEmployeeSelect(e.employee_id);
        }     
    }

    const onSetModels = (e) => {
        setModels(e);
    }

    const actionAdd = () => {
    }
    
    return (
        <DataTableCrudLocalComp multiple={true} actionStatus="crud" title={title} models={models} toolbar={true} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} search={true}
            columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.setModels} changeStatusValidate={props.setChangeStatus} actionAdd={actionAdd}
            toast={props.toast} inputValidate={false} filterField="name" rows={10}  dialogStyle={{width: "500px"}} rowClassName={props.rowClassName}/>
    );
}

export default LoanDetail;