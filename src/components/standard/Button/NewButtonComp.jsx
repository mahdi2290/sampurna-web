import React, { Fragment } from "react";
import { Button } from "primereact/button";
// import * as CiIcons from "react-icons/ci";

const NewButtonComp = (props) => {
    return (
        <Fragment>
            <Button type="button" key="newButton" className="p-button-text p-button-sm mr-2" onClick={() => props.onClick()}>
                <i className="pi pi-file"></i>
                <span className="px-1" style={{marginTop: "3px"}}>{props.label}</span>
            </Button>
        </Fragment>
    )
}

export default NewButtonComp;