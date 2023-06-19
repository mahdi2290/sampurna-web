import React, { Fragment, useState, useEffect } from "react";
import DataTableCrudLocalComp from "../../../components/standard/DataTable/DataTableCrudLocalComp";
import InputTextComp from "../../../components/standard/Form/InputTextComp";
import InputNumberComp from "../../../components/standard/Form/InputNumberComp";
import { GlobalConsumer } from "../../../config/Context";

const DOClaim = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.empty);

    const title = "List Klaim";
    const columnsTable = [
        { field: 'product_name', header: 'Nama Toko', sortable: false, style: "percent", width: 35},
        { field: 'uom', header: 'Produk', sortable: false, style: "percent", width: 20},
        { field: 'qty', header: 'Qty', sortable: false, style: "percent", width: 15, body:"currency"},
        { field: 'delivery_address', header: 'Harga', sortable: false, style: "percent", width: 15},
        { field: 'total', header: 'Total', sortable: false, style: "percent", width: 15},
        { field: 'action', header: '' },
    ];

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

    const dynamicForm = (
            <Fragment>
                <InputTextComp className="field col-12 md:col-12" field="product_name" title="Nama Toko" value={model.product_name} onChange={(e) => onInputChange(e)} />
                <InputTextComp className="field col-12 md:col-12" field="uom" title="Produk" value={model.uom} onChange={(e) => onInputChange(e)} />
                <InputNumberComp className="field col-12 md:col-12" field="qty" title="Qty" value={model.qty} onChange={(e) => onInputNumberChange('qty', e)} />
                <InputNumberComp className="field col-12 md:col-12" field="qty" title="Harga" value={model.qty} onChange={(e) => onInputNumberChange('qty', e)} />
                <InputNumberComp className="field col-12 md:col-12" field="qty" title="Total" value={model.qty} onChange={(e) => onInputNumberChange('qty', e)} />
        </Fragment>
    )

    const onSetModel = (e) => {
        setModel(e);
    }

    const onSetModels = (e) => {
        props.dispatch({ type: "add-data", id:'product', data: e });
        setModels(e);
    }

    const actionAdd = () => {
    }

    useEffect(() => {
        const dispatch = props.dispatch({ type: "get-data", id: 'product'});

        if (dispatch['data'].length > 0) {
            onSetModels(dispatch['data']);
        } else {
            onSetModels(props.models);
        }
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DataTableCrudLocalComp multiple={true} actionStatus="crud"  title={title} models={models} toolbar={true} setModels={onSetModels} emptyModel={props.empty} model={model} setModel={onSetModel} search={true}
            columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.setModels} changeStatusValidate={props.setChangeStatus} actionAdd={actionAdd}
            toast={props.toast} inputValidate={true} filterField="product_name" rows={5}  dialogStyle={{width: "500px"}} rowClassName={props.rowClassName}
            onCustomSaveState={(state) => sessionStorage.setItem("do-product", JSON.stringify(state)) }  onCustomRestoreState={() => JSON.parse(sessionStorage.getItem("do-product"))}
            />
    );
}

export default GlobalConsumer(DOClaim);
