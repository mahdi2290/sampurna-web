import React, { Fragment } from "react";
// import ToolbarComp from "../Menu/ToolbarComp";
import DataTableEditTableComp from "./DataTableEditTableComp";
import MenubarComp from "../Menu/MenubarComp";

const DataTableCrudEditTableComp = (props) => {
    const actionButtonToolbar = (e) => {
        switch (e) {
            case "new":
                break;

            case "save":
                break;

            default:
                break;
        }
    }

    return (
        <Fragment>
            <div className="grid crud-demo">
                <div className="col-12">
                    <MenubarComp field="toolbar-new"  action="new" actionButton={(e) => actionButtonToolbar(e)} />
                    {/* <ToolbarComp field="toolbar-crud" action="new" actionButton={(e) => actionButtonToolbar(e)} /> */}
                </div>

                <div className="col-12">
                    <DataTableEditTableComp title={props.title} models={props.models} columnsTable={props.columnsTable} optionsValue={props.optionsValue}/>
                </div>
            </div>
        </Fragment>
    )
}

export default DataTableCrudEditTableComp;
