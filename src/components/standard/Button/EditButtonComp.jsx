import React, { Fragment } from "react";
import { Button } from "primereact/button";
// import * as CiIcons from "react-icons/ci";

const EditButtonComp = (props) => {
    return (
        <Fragment>
            <Button type="button" key="editButton" icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => props.onClick()}/>
        </Fragment>
    )
}

export default EditButtonComp;