import React, { Fragment, useState, useEffect } from "react";
import DataTableCrudLocalComp from "../../../components/standard/DataTable/DataTableCrudLocalComp";
import InputTextComp from "../../../components/standard/Form/InputTextComp";

const CargoMemo = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);

    const columnsTable = [
        { field: 'reference_no', header: 'No. Referensi', sortable: false, style: "percent", width: 12},
        { field: 'ujt', header: 'UJT', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'final_ujt', header: 'Final UJT', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'ujt_var', header: 'UJT Var', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'ujt_void', header: 'Void', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'loan', header: 'Loan', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'bonus_claim', header: 'Bonus/Claim', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'total', header: 'Total', sortable: false, style: "percent", width: 11, body:"currency2"},
        { field: 'status', header: 'Status', sortable: false, style: "percent", width: 11},
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
        <Fragment>
            <DataTableCrudLocalComp multiple={true} actionStatus="crud"  title={props.title} models={models} toolbar={false} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} search={true}
                columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.setModels} changeStatusValidate={props.setChangeStatus} actionAdd={actionAdd}
                toast={props.toast} inputValidate={true} filterField="name" rows={5}  dialogStyle={{width: "500px"}} rowClassName={props.rowClassName}/>
        </Fragment>
    )
}

export default CargoMemo;
