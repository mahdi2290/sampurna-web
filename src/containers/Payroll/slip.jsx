import React, { Fragment, useRef } from 'react';
import { Button } from 'primereact/button';
import { useReactToPrint } from "react-to-print";
// import DumpTruckSlip from "../../components/report/slip/dumptruck";
import SlipPayrollReport from "../../components/report/slip/slip_payroll";

const SlipPage = (props) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Fragment>
            <div className="grid">
                <div className="col">
                    <Button type="button" onClick={handlePrint} label="Print" icon="pi pi-print" className="col-2 mb-3" />
                    <div ref={componentRef}>
                        {
                            props.employee.length > 0 ? props.employee.map((row) => {
                                return <SlipPayrollReport payroll_id={props.payroll_id} employee_id={row.employee_id} />
                            }) : ""
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SlipPage;