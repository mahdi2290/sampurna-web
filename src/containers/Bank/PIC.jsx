import React, { Fragment, useState, useEffect } from "react";
import DataTableCrudLocalComp from "../../components/standard/DataTable/DataTableCrudLocalComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";

const BankPIC = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);

    const title = "List PIC";
    const columnsTable = [
        { field: 'name', header: 'Nama', sortable: false, style: "fix", width:{ width:'40%' }},
        { field: 'phone', header: 'Telepon', sortable: false, style: "fix", width:{ width:'25%' }},
        { field: 'branch', header: 'Cabang', sortable: false, style: "fix", width:{ width:'25%' }},
        { field: 'action', header: '' },
    ];

    const dynamicForm = (
            <Fragment>
                <InputTextComp className="field col-12 md:col-12 mb-0" field="name" title="Nama" value={model.name} onChange={(e) => onInputChange(e)} />
                <InputTextComp className="field col-12 md:col-12 mb-0" field="phone" title="Telepon" value={model.phone} onChange={(e) => onInputChange(e)} />
                <InputTextComp className="field col-12 md:col-12 mb-0" field="branch" title="Cabang" value={model.branch} onChange={(e) => onInputChange(e)} />
        </Fragment>
    )

    const onInputChange = (e) => {
        e.preventDefault();

        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value;

        setModel(modelBefore);
    };

    useEffect(() => {
        setModels(props.models);
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSetModel = (e) => {
        setModel(e);
    }

    const onSetModels = (e) => {
        setModels(e);
    }

    const actionAdd = () => {

    }

    return (
        <DataTableCrudLocalComp multiple={true} actionStatus="crud"  title={title} models={models} toolbar={true} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} search={true}
            columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.setModels} changeStatusValidate={props.setChangeStatus} actionAdd={actionAdd}
            toast={props.toast} inputValidate={true} filterField="name" rows={5}  dialogStyle={{width: "500px"}} rowClassName={props.rowClassName}/>
    );
}

export default BankPIC;
