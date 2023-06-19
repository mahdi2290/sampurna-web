import React, { Fragment } from 'react';
import { Toolbar } from 'primereact/toolbar';
import NewButtonComp from '../Button/NewButtonComp';
import EditButtonComp from '../Button/EditButtonComp';
import SaveButtonComp from '../Button/SaveButtonComp';
import PrintButtonComp from '../Button/PrintButtonComp';
import ExportButtonComp from '../Button/ExportButtonComp';
import RemoveButtonComp from '../Button/RemoveButtonComp';
import BackButtonComp from '../Button/BackButtonComp';
import RefreshButtonComp from '../Button/RefreshButtonComp';

const ToolbarComp = (props) => {
    const leftComponent = () => {
        switch (props.action) {
            case "list":
                return (
                    <Fragment>
                        <RefreshButtonComp label="Refresh" onClick={() => props.actionButton("refresh") } />
                        <NewButtonComp label="New" onClick={() => props.actionButton("new") } />
                        <PrintButtonComp label="Print" onClick={() => props.actionButton("print") } />
                        <ExportButtonComp label="Export" onClick={() => props.actionExport() } />
                    </Fragment>
                );
            case "crud":
                return (                    
                    <Fragment>
                        <BackButtonComp action="back" label="Back" onClick={() => props.actionButton("back") } />
                        <NewButtonComp label="New" onClick={() => props.actionButton("new") } />
                        <SaveButtonComp label="Save" onClick={() => props.actionButton("save") } />
                    </Fragment>
                );
            case "new":
                return (                    
                    <Fragment>
                        <NewButtonComp label="Add" onClick={() => props.actionButton("new") } />
                    </Fragment>
                );
            case "table-edit":
                return (
                    <Fragment>
                        <EditButtonComp label="" onClick={() => props.actionButton("edit") } />
                    </Fragment>
                );
            case "table-delete":
                return (
                    <Fragment>
                        <EditButtonComp label="" onClick={() => props.actionButton("edit") } />
                        <RemoveButtonComp label="" onClick={() => props.actionButton("delete") } />
                    </Fragment>
                );
        
            default:
                break;
        }
    }

    return (
        <Fragment>
            <Toolbar key={props.field} left={leftComponent}/>
        </Fragment>
    )
}

export default ToolbarComp;