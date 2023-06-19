import React, { Fragment, useState, useEffect } from "react";
import { APICashierTypeUJT } from "../../../components/api/APIMaster";
import DataTableCrudLocalComp from "../../../components/standard/DataTable/DataTableCrudLocalComp";
import AutoCompleteComp from "../../../components/standard/Form/AutoCompleteComp";
import DropDownComp from "../../../components/standard/Form/DropDownComp";
import DatePickerComp from "../../../components/standard/Form/DatePickerComp";
import InputNumberComp from "../../../components/standard/Form/InputNumberComp";
import InputTextComp from "../../../components/standard/Form/InputTextComp";
import { GlobalConsumer } from "../../../config/Context";

const CargoKasbon = (props) => {
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.emptyModel);
    const [kasbonData, setKasbonData] = useState([]);
    const [kasbonSelect, setKasbonSelect] = useState(null);
    
    const title = "List Kasbon/Rembesan";
    const columnsTable = [
        { field: 'cashier_type_id.name', header: 'Jenis Kasbon', sortable: false, style: "percent", width: 20},
        { field: 'amount', header: 'Nominal', sortable: false, style: "percent", width: 20, body:"currency2"},
        { field: 'memo', header: 'Memo', sortable: false, style: "percent", width: 25},
        { field: 'receipt_id.recipt_no', header: 'No Receipt', sortable: false, style: "percent", width: 20},
        { field: 'action', header: '' },
    ];

    const shiftData = [
        { name: 1 },
        { name: 2 },
        { name: 3 }
    ];

    const counterData = [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" }
    ];

    // Drop Down
    const [shiftSelect, setShiftSelect] = useState(null);
    const [counterSelect, setCounterSelect] = useState(null);

    const dynamicForm = (
        <Fragment>
            <div className="grid">
                <DatePickerComp className="field col-12 md:col-12" validate={false} field="issue_date" title="Tgl Akhir" value={model.issue_date} onChange={(e) => { model.issue_date = e; }} />
                <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="cashier_type_id" title="Jenis Kasbon" showField="name" models={kasbonData}
                    queryData={(e) => getCashierType(e)} value={kasbonSelect} setSelectValue={(e) => setKasbonSelect(e)} onChange={(e) => { setKasbonSelect(e.value); model.cashier_type_id = e.value; }} />                
                <DropDownComp className="field col-12 md:col-6" validate={false} field="counter" title="Loket" optionLabel="name" optionValue="name" options={counterData} value={counterSelect}
                    onChange={(e) => { setCounterSelect(e.value); model.counter = e.value; }} />
                <DropDownComp className="field col-12 md:col-6" validate={false} field="shift" title="Shift" optionLabel="name" optionValue="name" options={shiftData} value={shiftSelect}
                    onChange={(e) => { setShiftSelect(e.value); model.shift = e.value; }} />
                <InputNumberComp className="field col-12 md:col-12" validate={false} field="amount" title="Nominal" value={model.amount} onChange={(e) => model.amount = e.value } />
                <InputTextComp className="field col-12 md:col-12" validate={false} field="memo" title="Memo" value={model.memo} onChange={(e) => onInputChange(e)} />
            </div>
        </Fragment>
    )

    const onInputChange = (e) => {
        e.preventDefault();

        let modelBefore = { ...model };
        modelBefore[e.target.id] = e.target.value;

        setModel(modelBefore);
    };

    const getCashierType = async(keyword) => {
        const res = await APICashierTypeUJT(keyword);

        setKasbonData(null);

        return res;
    }

    const onSetModel = (e) => {
        setModel(e);
    }

    const onSetModels = (e) => {
        props.dispatch({ type: "add-data", id:'kasbon', data: e });
        setModels(e);        
    }

    const actionAdd = () => {
        setCounterSelect(counterData[0].name);
        setShiftSelect(shiftData[0].name);

        setKasbonData(null);
    }

    useEffect(() => {        
        const dispatch = props.dispatch({ type: "get-data", id: 'kasbon'});
        
        if (dispatch) {
            onSetModels(dispatch['data']);
        } else {
            onSetModels(props.models);
        }
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <Fragment>
            <DataTableCrudLocalComp multiple={true} actionStatus="crud"  title={title} models={models} toolbar={true} setModels={onSetModels} emptyModel={props.emptyModel} model={model} setModel={onSetModel} search={true}
                columnsTable={columnsTable} dynamicForm={dynamicForm} pushData={props.pushData} changeStatusValidate={props.setChangeStatus} actionAdd={actionAdd} 
                checkbox={true} selection={props.selection} setSelectionChange={props.setSelectionChange}
                toast={props.toast} inputValidate={false} filterField="name" rows={5}  dialogStyle={{width: "500px"}} rowClassName={props.rowClassName}/>
        </Fragment>
    )
} 

export default GlobalConsumer(CargoKasbon);