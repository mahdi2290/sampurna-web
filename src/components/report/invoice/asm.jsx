import React, { Fragment, useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { formatDateTimeFullString, formatCurrency } from "../../../helpers/FormatHelpers";
import angkaTerbilang from '@develoka/angka-terbilang-js';

const InvoiceASMPage = (props) => {
    const componentRef = useRef();
    const [date, setDate] = useState(null);

    let dpp = 0;
    const ppn = ( 10 / 100 );

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const capitalizeFirstLowercaseRest = str => {
        const words = str.split(" ");

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        return words.join(" ");
    };

    useEffect(() => {
        setDate(formatDateTimeFullString(new Date()));
    }, [props]);

    return (
        <Fragment>
            <Button type="button" onClick={handlePrint} label="Print" icon="pi pi-print" className="mb-3" />

            <div className="grid">
                <div className="col">
                    <div className="card">
                        <div ref={componentRef} className="sg-page">
                            <div className="sg-layout-report">
                                <div className="sg-row">
                                    <div className="sg-column">
                                        <img src={process.env.PUBLIC_URL + "/assets/images/logo/asm.png"} className="sg-logo" alt="Logo" />
                                        <div className="sg-company-name">PT Alam Sampurna Makmur</div>
                                    </div>
                                    <div className="sg-column">
                                        <div className="sg-company-address">
                                            <p>RUKO SANTA MONICA NO. 8</p>
                                            <p>KELAPA DUA, KAB TANGERANG, BANTEN</p>
                                            <p>Email : alamsampurnamakmur@sampurna-group.com</p>
                                            <p>Telp. 54217737 | 54211277</p>
                                            <p>Fax. 5457811</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sg-report-title">INVOICE</div>
                                <div className="sg-row">
                                    <div className="sg-column">
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Customer
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.customer_name}
                                            </div>
                                        </div>
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Plant
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.plant_name}
                                            </div>
                                        </div>
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Material
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.product_name}
                                            </div>
                                        </div>
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Pembayaran
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.payment_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sg-column">
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Nomor Invoice
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.invoice_no}
                                            </div>
                                        </div>
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Tanggal
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.invoice_date}
                                            </div>
                                        </div>
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                Nomor PO
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.po_no}
                                            </div>
                                        </div>
                                        <div className="sg-container-info">
                                            <div className="sg-container-info-title">
                                                GRR List
                                            </div>
                                            <div className="sg-container-info-value">
                                                {props.header.grr_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="sg-table-container">
                                <thead>
                                    <tr>
                                        <td>
                                            <div className="sg-layout-report-invoice-space"></div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <table className="sg-table">
                                                    <thead>
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Date</th>
                                                            <th>No Polisi</th>
                                                            <th>No SJ</th>
                                                            <th>No DO</th>
                                                            <th>P</th>
                                                            <th>L</th>
                                                            <th>I</th>
                                                            <th>M3/Ton</th>
                                                            <th>@Rp</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            props.detail.map((row, i) => {
                                                                dpp = dpp + row.total;
                                                                return <tr>
                                                                    <td style={{minWidth:'50px',textAlign:'center'}}>{i + 1}</td>
                                                                    <td style={{minWidth:'120px',textAlign:'center'}}>{row.date}</td>
                                                                    <td style={{minWidth:'100px',textAlign:'center'}}>{row.plate_no}</td>
                                                                    <td style={{minWidth:'100px',textAlign:'center'}}>{row.sj_no}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'center'}}>{row.do_no}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'right'}}>{formatCurrency(row.length, 3)}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'right'}}>{formatCurrency(row.width, 3)}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'right'}}>{formatCurrency(row.height, 3)}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'right'}}>{formatCurrency(row.weight, 3)}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'right'}}>{formatCurrency(row.price, 2)}</td>
                                                                    <td style={{minWidth:'80px',textAlign:'right'}}>{formatCurrency(row.total, 2)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <div className="sg-summary">
                                                    <div className="sg-row">
                                                        <div className="sg-column-80">
                                                            <div className="sg-currency-title">
                                                                Terbilang :
                                                            </div>
                                                            <div className="sg-currency-value">
                                                                {capitalizeFirstLowercaseRest(angkaTerbilang(dpp + (dpp * ppn)))} Rupiah
                                                            </div>
                                                        </div>
                                                        <div className="sg-column-20">
                                                            <table className="sg-summary-table">
                                                                <tr>
                                                                    <td className="sg-summary-table-title">DPP</td>
                                                                    <td className="sg-summary-table-value">{formatCurrency(dpp, 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="sg-summary-table-title">PPN</td>
                                                                    <td className="sg-summary-table-value">{formatCurrency(dpp * ppn, 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="sg-summary-table-title">Total</td>
                                                                    <td className="sg-summary-table-value">{formatCurrency(dpp + (dpp * ppn), 2)}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <div className="sg-page-footer-invoice-space"></div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="sg-page-footer">
                                <div className="sg-content-footer">
                                    <div id="content" className="sg-footer">
                                        {date}
                                        <div id="pageFooter">
                                            {/* Page {page} of {pages} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default InvoiceASMPage;
