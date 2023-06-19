import React, { Fragment, useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import DataTableCrudLocalComp from "../../components/standard/DataTable/DataTableCrudLocalComp";
import InputTextAreaComp from "../../components/standard/Form/InputTextAreaComp";
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
import * as CrudService from '../../service/Employee/SkorsingService';

const Skorsing = (props) => {
    const datatable = useRef();
    const [models, setModels] = useState([]);
    const [model, setModel] = useState(props.emptyModel);
    
    const title = "List Skorsing";
    const columnsTable = [
        { field: 'start_date', header: 'Tgl Mulai', sortable: false, style: "fix", width:{ width:'20%' }},
        { field: 'end_date', header: 'Tgl Akhir', sortable: false, style: "fix", width:{ width:'20%' }},
        { field: 'memo', header: 'Memo', sortable: false, style: "fix", width:{ width:'50%' }},
        { field: 'action', header: '' },
    ];

    useEffect(() => {
        setModels(props.models);
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSetModel = (e) => {
        e.employee_id = props.id;

        setValues(e);
        setModel(e);
    }

    const onSetModels = (e) => {
        setModels(e);
    }

    const onSubmited = async (values, actions) => {
        let form = null;
        let result = null;

        form = new FormData();

        let emptyModel = props.emptyModel;

        Object.keys(emptyModel).map(key => {
            let valueData = "";
            if (values.hasOwnProperty(key)) {
                if (values[key] === null ) {
                    valueData = "";    
                } else {    
                    valueData = values[key];
                }                
            }

            if (valueData.hasOwnProperty('id')) {
                form.append(key, valueData.id);
            } else {
                form.append(key, valueData);
            }

            return key;
        });

        if (values.id > 0) {
            result = await CrudService.PutData(values.id, form);
        } else {
            result = await CrudService.PostData(form);
        }

        if (result.status === 200) {
            props.setToast(false, result.message);
            
            onSetModel(emptyModel);
            props.setChangeStatus();
            datatable.current.setDialogVisible();
            
            props.getData();
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });

            props.setToast(true, result.title);
        } else if (result.status === 401) {
            props.setToast(true, result.message);
        }
    }

    const actionSave = () => {
        handleSubmit();
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: props.emptyModel,
        onSubmit: onSubmited,
    });

    const actionAdd = () => {

    }

    const dynamicForm = (
        <Fragment>
            <form onSubmit={handleSubmit} autoComplete="off">
                <DatePickerComp className="field col-12 md:col-6 mb-0" validate={true} field="start_date" title="Tgl Mulai" value={values.start_date} onChange={(e) => { values.start_date = e; }} onBlur={handleBlur} errors={errors} touched={touched} />
                <DatePickerComp className="field col-12 md:col-6" validate={true} field="end_date" title="Tgl Akhir" value={values.end_date} onChange={(e) => { values.end_date = e; }} onBlur={handleBlur} errors={errors} touched={touched} />
                <InputTextAreaComp className="field col-12 md:col-12" validate={true} field="memo" title="Keterangan" value={values.memo} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />                
            </form>
        </Fragment>
    )

    return (
        <DataTableCrudLocalComp actionStatus="crud" ref={datatable} multiple={false} title={title} models={models} toolbar={true} setModels={onSetModels} model={model} emptyModel={props.emptyModel} setModel={onSetModel} search={true}
            columnsTable={columnsTable} dynamicForm={dynamicForm} changeStatusValidate={props.setChangeStatus} actionSave={actionSave} actionAdd={actionAdd} setHeight={true}
            toast={props.toast} inputValidate={false} rows={10}  dialogStyle={{width: "500px"}} />
    );
}

export default Skorsing;