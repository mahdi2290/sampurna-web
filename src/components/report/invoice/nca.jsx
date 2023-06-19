import React, { Fragment, useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { formatDateTimeFullString, formatCurrency } from "../../../helpers/FormatHelpers";
import angkaTerbilang from '@develoka/angka-terbilang-js';

// import "./../../../assets/css/report-invoice.scss";

const InvoiceNCAPage = (props) => {
    const [date, setDate] = useState(null);
    const componentRef = useRef();
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
    }, []);

    return (
        <Fragment>
            <Button type="button" onClick={handlePrint} label="Print" icon="pi pi-print" className="mb-3" />
            
            <div className="grid">
                <div className="col">
                    <div className="card">
                        <page ref={componentRef}>
                            <div className="page-header">
                                <div className="row">
                                    <div className="column">
                                        <img src={process.env.PUBLIC_URL + "/assets/images/logo/nca.png"} className="logo-image" alt="Logo" />
                                        <div className="company-name">PT Niaga Citra Abadi</div>
                                    </div>
                                    <div className="column">
                                        {/* <div className="address">
                                            <p>RUKO SANTA MONICA NO. 8</p>
                                            <p>KELAPA DUA, KAB TANGERANG, BANTEN</p>
                                            <p>Email : alamsampurnamakmur@sampurna-group.com</p>
                                            <p>Telp. 54217737 | 54211277</p>
                                            <p>Fax. 5457811</p>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="title">INVOICE</div>
                                <div class="row">
                                    <div class="column">
                                        <table className="table-left">
                                            <tr>
                                                <td className="table-title">Customer</td>
                                                <td className="table-value">{props.header.customer_name}</td>
                                            </tr>
                                            <tr>
                                                <td className="table-title">Plant</td>
                                                <td className="table-value">{props.header.plant_name}</td>
                                            </tr>
                                            <tr>
                                                <td className="table-title">Material</td>
                                                <td className="table-value">{props.header.product_name}</td>
                                            </tr>
                                            <tr>
                                                <td className="table-title">Pembayaran</td>
                                                <td className="table-value">{props.header.payment_name}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="column">
                                        <table className="table-right">
                                            <tr>
                                                <td className="table-title">Nomor Invoice</td>
                                                <td className="table-value">{props.header.invoice_no}</td>
                                            </tr>
                                            <tr>
                                                <td className="table-title">Tanggal</td>
                                                <td className="table-value">{props.header.invoice_date}</td>
                                            </tr>
                                            <tr>
                                                <td className="table-title">Nomor PO</td>
                                                <td className="table-value">{props.header.po_no}</td>
                                            </tr>
                                            {/* <tr>
                                                <td className="table-title">GRR List</td>
                                                <td className="table-value">{props.header.grr_list}</td>
                                            </tr> */}
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <table className="table-content">
                                <thead>
                                    <tr>
                                        <td>
                                            <div className="page-header-space"></div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <table className="table-report">
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
                                                <div className="report-summary">
                                                    <div className="row">
                                                        <div className="column-80">                                            
                                                            <div className="currency-title">
                                                                Terbilang :
                                                            </div> 
                                                            <div className="currency-value">
                                                                {capitalizeFirstLowercaseRest(angkaTerbilang(dpp + (dpp * ppn)))} Rupiah
                                                            </div>
                                                        </div>
                                                        <div className="column-20">
                                                            <table className="table-summary">
                                                                <tr>
                                                                    <td className="table-title">DPP</td>
                                                                    <td className="table-value">{formatCurrency(dpp, 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="table-title">PPN</td>
                                                                    <td className="table-value">{formatCurrency(dpp * ppn, 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="table-title">Total</td>
                                                                    <td className="table-value">{formatCurrency(dpp + (dpp * ppn), 2)}</td>
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
                                            <div className="page-footer-space"></div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="page-footer">
                                <div className="content">
                                    <div id="content" className="footer">
                                        {date}
                                        <div id="pageFooter">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </page>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default InvoiceNCAPage;
