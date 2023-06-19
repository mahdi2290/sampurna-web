import React, { Fragment } from "react";
import { Button } from "primereact/button";
// import * as CiIcons from "react-icons/ci";

const RemoveButtonComp = (props) => {
    return (
        <Fragment>
            <Button type="button" key="deleteButton" icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => props.onClick()} />                
        </Fragment>
    )
}

export default RemoveButtonComp;