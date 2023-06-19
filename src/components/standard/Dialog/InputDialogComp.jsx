import React, { Fragment } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const InputDialogComp = (props) => {

    const hideDialog = () => {
        props.setVisible();
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text p-button-sm" onClick={props.actionSave} />
        </>
    );

    return (
        <Fragment>

        {
            props.setHeight ?            
                <Dialog key={props.key} visible={props.visible} style={props.style} header={props.title} modal className="p-fluid h-full" footer={dialogFooter} onHide={hideDialog}>
                    {props.dynamicForm}
                </Dialog>
            : 
                <Dialog key={props.key} visible={props.visible} style={props.style} header={props.title} modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    {props.dynamicForm}
                </Dialog>
        }

        </Fragment>
    )
}

export default InputDialogComp;