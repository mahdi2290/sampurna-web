import React, { Fragment, useState, useEffect } from "react";
import DataTableCrudLocalComp from "../../components/standard/DataTable/DataTableCrudLocalComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";

// Component
import InputSwitchComp from "../../components/standard/Form/InputSwitchComp";
import { DataTable } from "primereact/datatable";

const Plant = (props) => {
    const [statusFlag, setStatusFlag] = useState(false);
    const [doFlag, setDoFlag] = useState(false);
    const [poFlag, setPOFlag] = useState(false);

    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);

    const [globalFilter, setGlobalFilter] = useState(false);;

    const title = "List Plant";
    const columnsTable = [
        { field: 'name', header: 'Nama', sortable: false, style: "percent", width: 1 },
        { field: 'pic', header: 'Pic', sortable: false, style: "percent", width: 1 },
        { field: 'address', header: 'Alamat', sortable: false, style: "percent", width: 1 },
        { field: 'is_do', header: 'DO', sortable: false, body: "boolean", style: "percent", width: 1 },
        { field: 'is_po', header: 'PO', sortable: false, body: "boolean", style: "percent", width: 1 },
        { field: 'status', header: 'Sts', sortable: false, body: "boolean", style: "percent", width: 1 },
        { field: 'action', header: '' },
    ];

    const dynamicForm = (
        <Fragment>
            <div className="p-fluid grid">
                <InputTextComp className="field col-12 md:col-12" field="name" title="Nama" value={model.name} onChange={(e) => onInputChange(e)} />
                <InputTextComp className="field col-12 md:col-12" field="pic" title="Pic" value={model.phone} onChange={(e) => onInputChange(e)} />
                <InputTextComp className="field col-12 md:col-12" field="address" title="Alamat" value={model.phone} onChange={(e) => onInputChange(e)} />
                <InputSwitchComp className="field col-12 md:col-3" validate={false} field="is_do" title="DO" checked={doFlag} onChange={(e) => { onSwitchChange(e); setDoFlag(e.value); }} />
                <InputSwitchComp className="field col-12 md:col-3" validate={false} field="is_po" title="PO" checked={poFlag} onChange={(e) => { onSwitchChange(e); setPOFlag(e.value); }} />
                <InputSwitchComp className="field col-12 md:col-3" validate={false} field="status" title="Status" checked={statusFlag} onChange={(e) => { onSwitchChange(e); setStatusFlag(e.value); }} />
            </div>
        </Fragment>
    )

    const onInputChange = (e) => {
        e.preventDefault();

        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value;

        setModel(modelBefore);
    };

    const onSwitchChange = (e) => {
        e.preventDefault();

        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value ? 1 : 0;

        setModel(modelBefore);
    };

    useEffect(() => {
        setModels(props.models);
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSetModel = (e) => {
        setDoFlag(e.is_do === 1 ? true : false);
        setPOFlag(e.is_po === 1 ? true : false);
        setStatusFlag(e.status === 1 ? true : false);

        setModel(e);
    }

    const onSetModels = (e) => {
        setModels(e);
    }

    const actionAdd = () => {

    }

    return (
        <DataTableCrudLocalComp multiple={true} actionStatus="crud" title={title} models={models} toolbar={true} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} columnsTable={columnsTable} dynamicForm={dynamicForm}
            pushData={props.setModels} changeStatusValidate={props.setChangeStatus} toast={props.toast} inputValidate={true} filterField="name" rows={5} search={true} setGlobal={(e) => setGlobalFilter(e)}
            dialogStyle={{ width: "500px" }} rowClassName={props.rowClassName} actionAdd={actionAdd} />

    );
}

export default Plant;
