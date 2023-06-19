import React, { Fragment, useState, useEffect, useRef } from "react";
// import ToolbarComp from "../Menu/ToolbarComp";
import DataTableComp from "./DataTableComp";
import InputDialogComp from "../Dialog/InputDialogComp";
import DeleteDialogComp from "../Dialog/DeleteDialogComp";
import MenubarComp from "../Menu/MenubarComp";

const DataTableListComp = (props) => {
    const datatable = useRef(null);
    const [models, setModels] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const actionExport = () => {
        if (!props.excel) {
            datatable.current.actionExport();
        } else {
            props.actionExport();
        }
    }

    const actionConfirmDelete = (data) => {
        props.setModel(data);
        setDeleteDialog(true);
    }

    const actionDelete = () => {
        const res = props.actionDelete();

        if (res) {
            setDeleteDialog(false);
        }
    }

    useEffect(() => {
        setModels(props.models);
        setTotalRecords(props.totalRecords);
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <div className="col-12">
                {
                    props.toolbar ?
                        props.toolbarAction === "new" ?
                            <MenubarComp field="toolbar-new" action="new" actionButton={(e) => props.actionButtonToolbar(e)} actionExport={actionExport} />
                        :
                            <MenubarComp field="toolbar-list" action="list" actionButton={(e) => props.actionButtonToolbar(e)} actionExport={actionExport} />
                    :
                        ""
                }
            </div>

            <div className="col-12">
                <DataTableComp ref={datatable} api={props.api} title={props.title} models={models} GetAll={props.getAll} search={props.search} loading={props.loading} footerColumnGroup={props.footerColumnGroup}
                    rows={props.perPage} setPerPage={props.setPerPage} totalRecords={totalRecords} columnsTable={props.columns} actionStyle={{minWidth: "8rem", width: "10%"}} paginator={props.paginator}
                    actionStatus={props.actionStatus == null ? "edit" : props.actionStatus} actionEdit={(data) => props.actionEdit(data)} actionConfirmDelete={(data) => actionConfirmDelete(data)}
                    filterStatus={props.filterStatus} filterDynamic={props.filterDynamic} checkbox={props.checkbox} dataKey={props.dataKey} selection={props.selection} onSelectionChange={props.setSelectionChange}
                    tableType={props.tableType} rowGroupField={props.rowGroupField} rowExpansion={props.rowExpansion} onRowDoubleClick={props.onRowDoubleClick} setGlobal={props.setGlobal}
                />

                <InputDialogComp title={props.title} style={props.dialogStyle} visible={props.visibleDialog} setVisible={() => props.setVisibleDialog()} actionSave={props.actionSave} dynamicForm={props.dynamicForm} setHeight={props.setHeight} />

                <DeleteDialogComp visible={deleteDialog} actionDelete={actionDelete} onSetDeleteDialog={(e) => setDeleteDialog(e)} />
            </div>
        </Fragment>
    )
}

export default DataTableListComp;
