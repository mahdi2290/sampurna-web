import React, { Fragment, useState, useEffect } from "react";
import DataTableCrudLocalComp from "../../components/standard/DataTable/DataTableCrudLocalComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";

const OrderProduct = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);
    
    const title = "Input PIC";
    const columnsTable = [
        { field: 'name', header: 'Nama', sortable: false, style: "percent", width: 40},
        { field: 'qty', header: 'Qty', sortable: false, style: "percent", width: 15},
        { field: 'volume', header: 'Volume', sortable: false, style: "percent", width: 15},
        { field: 'weight', header: 'Weight', sortable: false, style: "percent", width: 15},
    ];

    const dynamicForm = (
            <Fragment>
                <InputTextComp className="field col-12 md:col-12 mb-0" field="name" title="Nama" value={model.name} onChange={(e) => onInputChange(e)} />
                <InputNumberComp className="field col-12 md:col-12 mb-0" field="qty" title="Qty" value={model.phone} onChange={(e) => onInputNumberChange("qty", e)} />
                <InputNumberComp className="field col-12 md:col-12 mb-0" field="volume" title="Volume" value={model.branch} onChange={(e) => onInputNumberChange("volume", e)} />
                <InputNumberComp className="field col-12 md:col-12 mb-0" field="weight" title="Weight" value={model.branch} onChange={(e) => onInputNumberChange("weight", e)} />
        </Fragment>
    )

    const onInputChange = (e) => {
        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value;

        setModel(modelBefore);
    };

    const onInputNumberChange = (field, e) => {    
        let modelBefore = { ...model };
        modelBefore[field] = e.value;

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
        <DataTableCrudLocalComp title={title} models={models} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} search={true}
            columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.setModels} changeStatusValidate={props.setChangeStatus} actionAdd={actionAdd}
            toast={props.toast} inputValidate={false} filterField="name" rows={5}  dialogStyle={{width: "500px"}} rowClassName={props.rowClassName}/>
    );
}

export default OrderProduct;