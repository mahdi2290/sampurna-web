import React, { Fragment } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DeleteDialogComp = (props) => {
    const hideDeleteDialog = () => {
        props.onSetDeleteDialog(false);
    };

    const dialogFooterDelete = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={props.actionDelete} />
        </>
    );

    return (
        <Fragment>
            <Dialog key={props.key} visible={props.visible} style={{ width: "500px" }} header="Konfirmasi" modal footer={dialogFooterDelete} onHide={hideDeleteDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    <span>
                        Apakah anda yakin akan menghapus data ini?
                    </span>
                </div>
            </Dialog>
        </Fragment>
    )
}

export default DeleteDialogComp;