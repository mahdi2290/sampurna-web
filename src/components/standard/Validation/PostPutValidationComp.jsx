import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import LoadingDialogComp from '../Dialog/LoadingDialogComp';
import ErrorDialogComp from '../Dialog/ErrorDialogComp';

function PostPutValidationComp(props) {
    const modelDialogFooter = (
        <>
            <Button className="p-button-text p-button-sm" onClick={props.backURL}>
                <i className="pi pi-chevron-left"></i>
                <span className="px-1" style={{marginTop: "3px"}}>Back</span>
            </Button>
            <Button className="p-button-text p-button-sm" onClick={() => props.setValidationVisible(false)}>
                <i className="pi pi-times"></i>
                <span className="px-1" style={{marginTop: "3px"}}>Close</span>
            </Button>
            <Button className="p-button-text p-button-sm" onClick={() => props.actionSave()}>
                <i className="pi pi-check"></i>
                <span className="px-1" style={{marginTop: "3px"}}>Save</span>
            </Button>
        </>
    );

    return (
        <div>
            <LoadingDialogComp visible={props.waitingDialog} />
            <Dialog visible={props.validationVisible} style={{ width: "600px" }} header="Konfirmasi" modal className="p-fluid" footer={modelDialogFooter} onHide={() => props.setValidationVisible(false)}>
                <p><b>Apakah Anda yakin, Anda akan keluar dari halaman ini?</b></p>
            </Dialog>

            <ErrorDialogComp visible={props.errorVisible} message={props.message} setVisible={() => props.setErrorVisible(false)}/>
        </div>
    )
}

export default PostPutValidationComp;
