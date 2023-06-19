import React, { Fragment, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { useReactToPrint } from "react-to-print";
import DeliveryReport from './../../../components/report/delivery_report';
import * as HeaderService from '../../../service/Sales/OrderCargoDetailService';
import { useEffect } from 'react';

const DeliveryReportPage = (props) => {
    const componentRef = useRef();
    const [model, setModel] = useState([]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const getData = async(id) => {
        const res = await HeaderService.GetReceipt(id);

        if (res.status === 200) {
            setModel(res.data);
        }
    }

    useEffect(() => {
        if (props.id > 0 ){
            getData(props.id);
        }
    }, [props.id]);

    return (
        <Fragment>
            <div className="grid">
                <div className="col">
                    <Button type="button" onClick={handlePrint} label="Print" icon="pi pi-print" className="col-2 mb-3" />
                    <div ref={componentRef}>
                        <DeliveryReport model={model} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default DeliveryReportPage;
