import { Fragment, useState } from "react"
import { useEffect } from "react";
import * as HeaderService from '../../service/Sales/OrderCargoDetailService';
import { formatDateReport, formatDateTimeReport, numberFormat } from "../../helpers/FormatHelpers";

const DeliveryReport = (props) => {
    const [date, setDate] = useState("");

    const getData = async() => {
        const res = await HeaderService.GetDate();

        const date = formatDateTimeReport(res);

        setDate(date);
    }

    useEffect(() => {
        getData();
    }, [props.model]);

    return (
        <Fragment>
            <div className="slip-page">
                <table className="slip-table">
                    <tbody>
                        <tr>
                            <td>
                                <div className="slip-row">
                                    <table className="slip-table-delivery-info" style={{marginTop: "-15px"}}>
                                        <tr>
                                            <td colSpan={4} style={{fontSize: "20px", textAlign: "center"}}><b>{props.model.company_name}</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} style={{fontSize: "18px", textAlign: "center"}}>Surat Jalan</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} style={{fontSize: "16px", textAlign: "center"}}>{props.model.reference_no}</td>
                                        </tr>
                                    </table>
                                    <div className="slip-row sg-margin-top-15">
                                        <div className="slip-column">
                                            <table className="slip-table-delivery-info">
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Truck No</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.plate_no}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Jenis Transaksi</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.order_type_name}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Material</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.multi_product === 0 ? props.model.product_name : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>P</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.multi_product === 0 ? props.model.length : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>L</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.multi_product === 0 ? props.model.width : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>T</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.multi_product === 0 ? props.model.height : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Jumlah</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.multi_product === 0 ? numberFormat(props.model.length * props.model.width * props.model.height, 3) : ""}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div className="slip-column">
                                            <table className="slip-table-delivery-info">
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Jenis Armada</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.fleet_type_name}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Tanggal</td>
                                                    <td style={{fontSize: "16px"}}>: {formatDateReport(props.model.issue_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Kepada Yth.</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.customer_name}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}></td>
                                                    <td style={{fontSize: "16px"}}>&nbsp; {props.model.plant_name}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>Asal</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.origin_name}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{fontSize: "16px"}}>DO No</td>
                                                    <td style={{fontSize: "16px"}}>: {props.model.do_no}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="slip-row sg-margin-top-30">
                                    <div className="slip-column">
                                        <div className="slip-border"></div>
                                        <table className="slip-table-delivery-sign">
                                            <tbody>
                                                <tr>
                                                    <td className="sg-text-center" style={{fontSize: "14px"}}>Pengirim</td>
                                                    <td className="sg-text-center" style={{fontSize: "14px"}}>Supir</td>
                                                    <td className="sg-text-center" style={{fontSize: "14px"}}>Gudang/Logistik</td>
                                                    <td className="sg-text-center" style={{fontSize: "14px"}}>Security</td>
                                                </tr>
                                                <tr>
                                                    <td className="sg-text-center penerima" style={{fontSize: "12px"}}><br/><br/><br/><br/><br/><br/>( _____________________)<br/>{date}</td>
                                                    <td className="sg-text-center penerima" style={{fontSize: "12px"}}><br/><br/><br/><br/><br/><br/>{ props.model.name !== "" ? "( " + props.model.name + " )" : "( _____________________)" }<br/>{props.model.nik}</td>
                                                    <td className="sg-text-center penerima" style={{fontSize: "12px"}}>
                                                        <br/><br/><br/><br/><br/><br/>( _____________________)<br/>{"\u00a0"}
                                                    </td>
                                                    <td className="sg-text-center penerima" style={{fontSize: "12px"}}>
                                                        <br/><br/><br/><br/><br/><br/>( _____________________)<br/>{"\u00a0"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default DeliveryReport
