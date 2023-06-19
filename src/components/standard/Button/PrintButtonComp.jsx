import React, { Fragment } from "react";
import { Button } from "primereact/button";
// import * as CiIcons from "react-icons/ci";

const PrintButtonComp = (props) => {
    return (
        <Fragment>
            <Button type="button" key="printButton" className="p-button-text p-button-sm mr-2" onClick={() => props.onClick()} >
                <i className="pi pi-print"></i>
                <span className="px-1" style={{marginTop: "3px"}}>{props.label}</span>
            </Button>
        </Fragment>
    )
}

export default PrintButtonComp;