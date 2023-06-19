import React, { Fragment, useState, forwardRef, useImperativeHandle } from "react";
import DataTableCompCrud from "./DataTableCompCrud";
import InputDialogComp from "../Dialog/InputDialogComp";
import DeleteDialogComp from "../Dialog/DeleteDialogComp";
import MenubarComp from "../Menu/MenubarComp";
import { DataTable } from "primereact/datatable";

const DataTableCrudLocalComp = forwardRef((props, ref) => {
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useImperativeHandle(ref, () => ({
        setDialogVisible() {
            setVisibleDialog(false);
        }
    }));

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const findIndexByIdList = (id) => {
        let index = -1;
        for (let i = 0; i < props.models.length; i++) {
            if (props.models[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexNameList = (id, name) => {
        let index = -1;
        for (let i = 0; i < props.models.length; i++) {
            if (props.models[i][props.filterField].toString().toLowerCase() === name && props.models[i].id !== id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const actionConfirmDelete = (data) => {
        props.setModel(data);
        setDeleteDialog(true);
    }

    const actionDelete = () => {
        if ( props.multiple ) {
            let _models = props.models.filter(val => val.id !== props.model.id);

            props.setModels(_models);
            props.setModel(props.emptyModel);

            if ( props.multiple ) {
                props.pushData("D", props.model);
            }
        } else {
            props.actionDelete();
        }

        props.changeStatusValidate();
        setDeleteDialog(false);
    }

    const actionEdit = (data) => {
        props.setModel({ ...data });
        setVisibleDialog(true);
    }

    const actionSave = () => {
        if ( props.multiple ) {
            let _models = [...props.models];
            let _model = { ...props.model };

            if (props.inputValidate) {
                const index = findIndexNameList(props.model.id, props.model[props.filterField].toString().toLowerCase());

                if ( index !== -1 ) {
                    props.toast.current.show({ severity: "error", summary: "Error!!!", detail: "Data sudah ada", life: 3000 })
                    return false;
                }
            }

            if (props.model.id === 0) {
                _model.id = createId();
                _models.push(_model);

                props.pushData("C", _model);
            }
            else {
                const index = findIndexByIdList(props.model.id);

                _models[index] = _model;

                props.pushData("U", props.model);
            }

            props.setModels(_models);

            props.setModel(props.emptyModel);
            props.changeStatusValidate();
            setVisibleDialog(false);
        } else {
            props.actionSave();
        }

        return true;
    }

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "new":
                props.setModel(props.emptyModel);
                props.actionAdd();
                setVisibleDialog(true);
                break;

            default:
                break;
        }
    }

    return (
        <Fragment>
            <div className="grid crud-demo">
                <div className="col-12">
                    {
                        props.toolbar ?
                            <MenubarComp field="toolbar-new" action="new-plant" actionButton={(e) => actionButtonToolbar(e)} />
                        :
                            ""
                    }
                </div>

                <div className="col-12">
                    {/* <DataTableComp api={false} title={props.title} search={props.search} models={props.models} rows={props.rows} columnsTable={props.columnsTable}
                        checkbox={props.checkbox} selection={props.selection} setSelectionChange={props.setSelectionChange} paginator={props.paginator} onRowDoubleClick={(e) => props.doubleClick ? actionEdit(e.data) : ""}
                        actionStatus={props.actionStatus} actionEdit={(data) => actionEdit(data)} actionConfirmDelete={(data) => actionConfirmDelete(data)} rowClassName={props.rowClassName}
                        onCustomSaveState={props.onCustomSaveState} onCustomRestoreState={props.onCustomRestoreState} setGlobal={false} GetAll={false} /> */}

                    <DataTableCompCrud api={false} title={props.title} search={props.search} models={props.models} rows={props.rows} columnsTable={props.columnsTable}
                        checkbox={props.checkbox} selection={props.selection} setSelectionChange={props.setSelectionChange} paginator={props.paginator} onRowDoubleClick={(e) => props.doubleClick ? actionEdit(e.data) : ""}
                        actionStatus={props.actionStatus} actionEdit={(data) => actionEdit(data)} actionConfirmDelete={(data) => actionConfirmDelete(data)} rowClassName={props.rowClassName}
                        onCustomSaveState={props.onCustomSaveState} onCustomRestoreState={props.onCustomRestoreState} setGlobal={false} GetAll={false} />

                    <InputDialogComp key={props.key} title={props.title} style={props.dialogStyle} visible={visibleDialog} setVisible={() => setVisibleDialog(false)} actionSave={actionSave} dynamicForm={props.dynamicForm} setHeight={props.setHeight} />

                    <DeleteDialogComp key={props.key} visible={deleteDialog} actionDelete={actionDelete} onSetDeleteDialog={(e) => setDeleteDialog(e)} />
                </div>
            </div>
        </Fragment>
    )
});

export default DataTableCrudLocalComp;
