import React, { Fragment } from "react";
import DeliveryReport from "./delivery_report";

const PayslipPage = () => {
    return (
        <Fragment>
            <DeliveryReport />
        </Fragment>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(PayslipPage, comparisonFn);
