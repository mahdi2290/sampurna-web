import React, { Fragment } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from 'primereact/progressbar';

const LoadingDialogComp = (props) => {
    return (
        <Fragment>
            <Dialog style={{width: '400px', backgroundColor: 'transparent'}} header="Loading..." visible={props.visible} showHeader={true} focusOnShow={false} resizable={false} modal closable={false}>
                <ProgressBar mode="indeterminate" style={{ height: '15px' }}></ProgressBar>
                <h6>Please wait...</h6>
            </Dialog>
        </Fragment>
    )
}

export default LoadingDialogComp;