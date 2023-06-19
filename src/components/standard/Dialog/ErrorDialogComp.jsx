import React, { Fragment } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const ErrorDialogComp = (props) => {    
    const hideDeleteDialog = () => {
        props.setVisible(false);
    };

    const dialogFooterDelete = (
        <>
            <Button className="p-button-text p-button-sm" onClick={hideDeleteDialog}>
                <i className="pi pi-times"></i>
                <span className="px-1" style={{marginTop: "3px"}}>Ok</span>
            </Button>
        </>
    );

    return (
        <Fragment>
            <Dialog visible={props.visible} style={{ width: "300px" }} header="Informasi" modal footer={dialogFooterDelete} onHide={hideDeleteDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    <span className="error">
                        {props.message}
                    </span>
                </div>
            </Dialog>
        </Fragment>
    )
}

export default ErrorDialogComp;