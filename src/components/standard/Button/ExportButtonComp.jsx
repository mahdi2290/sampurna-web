import React, { Fragment } from "react";
import { Button } from "primereact/button";
// import * as CiIcons from "react-icons/ci";

const ExportButtonComp = (props) => {
    return (
        <Fragment>
            <Button type="button" key="exportButton" className="p-button-text p-button-sm mr-2" onClick={() => props.onClick()}>
                <i className="pi pi-download"></i>
                <span className="px-1" style={{marginTop: "3px"}}>{props.label}</span>
            </Button>
        </Fragment>
    )
}

export default ExportButtonComp;