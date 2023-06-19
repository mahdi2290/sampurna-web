import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Ripple } from 'primereact/ripple';
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { formatBoolen, formatCurrency } from "../../../helpers/FormatHelpers";
import EditButtonComp from "../Button/EditButtonComp";
import RemoveButtonComp from "../Button/RemoveButtonComp";
import { Panel } from "primereact/panel";
import { RadioButton } from 'primereact/radiobutton';

const DataTableCompCrud = forwardRef((props, ref) => {
    const [stackStatus, setStackStatus] = useState(false);

    const dt = useRef(null)
    const [models, setModels] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [globalFilter, setGlobalFilter] = useState("");
    const [first, setFirst] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');
    const [actionWidth, setActionWidth] = useState({ minWidth: "5rem", width: "3%" })
    const [expandedRows, setExpandedRows] = useState(null);

    let scrollHeight = document.documentElement.clientHeight - 320;
    let heightString = scrollHeight.toString() + "px";
    let widthWindow = window.screen.availWidth;
    let widthFinal = 0;

    let localModeStorage = localStorage.getItem("layoutMode");

    if (localModeStorage === "static") {
        widthFinal = widthWindow - 410;
    } else {
        widthFinal = widthWindow - 85;
    }

    useImperativeHandle(ref, () => ({
        actionExport() {
            dt.current.exportCSV();
        }
    }));

    const getAll = (page, rows, keyword) => {
        checkWindowWidth();
        props.GetAll(page, rows, keyword);
    }

    const setLimit = (value) => {
        props.setPerPage(value);
    }

    const onInputFilter = (e) => {
        getAll(currentPage, props.rows, e)
    }

    const onPageKeyDown = (event, options) => {
        if (event.key === 'Enter') {
            const page = parseInt(currentPage);
            if (page < 1 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            }
            else {
                const first = currentPage ? options.rows * (page - 1) : 0;

                setFirst(first);
                setPageInputTooltip('Press \'Enter\' key to go to this page.');
            }

            getAll(page, props.perPage, globalFilter);
        }
    }

    const onInputGlobal = (e) => {
        checkWindowWidth();

        if (props.api) {
            onInputFilter(e.target.value);
        }

        setGlobalFilter(e.target.value);
    }

    const onPageCustom = (event) => {
        setFirst(event.first);
        setCurrentPage(event.page + 1);
        setLimit(event.rows);

        getAll(event.page + 1, event.rows, globalFilter);
    }

    const onPageInputChange = (event) => {
        setCurrentPage(event.target.value);
    }

    const paginationTemplate = {
        'PrevPageLink': (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            )
        },
        'NextPageLink': (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            )
        },
        'PageLinks': (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return <span className={className} style={{ userSelect: 'none' }}>...</span>;
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            )
        },
        'RowsPerPageDropdown': (options) => {
            const dropdownOptions = [
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 },
                { label: 100, value: 100 },
                { label: 200, value: 200 },
                { label: 'All', value: options.totalRecords }
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        'CurrentPageReport': (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText size="2" className="ml-1" value={currentPage} tooltip={pageInputTooltip}
                        onKeyDown={(e) => onPageKeyDown(e, options)} onChange={onPageInputChange} />
                </span>
            )
        }
    };

    const headerTable = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <div className="justify-content-start">
                <b>{props.title}</b>
            </div>
            <div className="justify-content-end">
                {
                    props.search &&
                        <span className="block p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText className="p-inputtext-sm" type="search" onInput={(e) => { onInputGlobal(e) }} placeholder="Search..." onBlur={(e) => onInputGlobal(e)} />
                        </span>
                }
            </div>
        </div>
    );

    const onActionButton = (rowData) => {
        switch (props.actionStatus) {
            case "edit":
                return (
                    <div className="actions" >
                        <EditButtonComp label="" onClick={() => props.actionEdit(rowData)} />
                    </div >
                );
            case "crud":
                return (
                    <div className="actions">
                        <EditButtonComp label="" onClick={() => props.actionEdit(rowData)} />
                        <RemoveButtonComp label="" onClick={() => props.actionConfirmDelete(rowData)} />
                    </div>
                );

            default:
                break;
        }
    }

    const priceTemplate = (rowData, col) => {
        return formatCurrency(rowData[col.field]);
    }

    const formatBooleanTable = (rowData, col) => {
        return formatBoolen(rowData[col.field]);
    }

    const currency2Template = (rowData, col) => {
        return formatCurrency(rowData[col.field], 2);
    }

    const currency3Template = (rowData, col) => {
        return formatCurrency(rowData[col.field], 3);
    }

    const currency4Template = (rowData, col) => {
        return formatCurrency(rowData[col.field], 4);
    }

    let dynamicColumns = props.columnsTable.map((col) => {
        let body = "";
        if (col.body === "currency") {
            body = priceTemplate;
        } else if (col.body === "boolean") {
            body = formatBooleanTable;
        } else if (col.body === "currency2") {
            body = currency2Template;
        } else if (col.body === "currency3") {
            body = currency3Template;
        } else if (col.body === "currency4") {
            body = currency4Template;
        }

        let data = null;

        if ( col.field === "action" ) {
            data = <Column key={col.field} header="Action" body={onActionButton} style={actionWidth} ></Column>;
        } else {
            let style;
            if (col.style === "percent") {
                const widthPixel = ( widthFinal * col.width ) / 100;
                style = { width: widthPixel + "px" };
            } else {
                style = col.width;
            }

            if ( col.editor ) {
                data = <Column key={col.field} field={col.field} header={col.header} dataType={col.body} style={style} sortable={col.sortable} body={body} frozen={col.frozen} alignFrozen={col.alignFrozen} editor={(options) => props.editor(options)} onCellEditComplete={props.onCellEditComplete}/>;
            } else {
                data = <Column key={col.field} field={col.field} header={col.header} dataType={col.body} style={style} sortable={col.sortable} body={body} frozen={col.frozen} alignFrozen={col.alignFrozen} />;
            }
        }

        return data;
    });

    const onRowGroupHeaderTemplate = (data) => {
        let fieldData = props.rowGroupField;

        var field = fieldData.split(".");

        return (
            <React.Fragment>
                <span className="image-text"><b>{ field.length === 1 ? data[field[0]] : data[field[0]][field[1]]}</b></span>
            </React.Fragment>
        );
    }

    const calculateTotal = (name) => {
        let total = 0;
        let fieldData = props.rowGroupField;

        var field = fieldData.split(".");

        if (models) {
            for (let row of models) {
                const data = field.length === 1 ? row[field[0]] : row[field[0]][field[1]]
                if (data === name) {
                    total++;
                }
            }
        }

        return total;
    }

    const onRowGroupFooterTemplate = (data) => {
        let fieldData = props.rowGroupField;

        var field = fieldData.split(".");

        return (
            <React.Fragment>
                <td colSpan="4" style={{ textAlign: 'right' }}><b>Total Data</b></td>
                <td><b>{calculateTotal(field.length === 1 ? data[field[0]] : data[field[0]][field[1]])}</b></td>
            </React.Fragment>
        );
    }

    const onRowExpansionTemplate = (data) => {
        return props.rowExpansion(data);
    }

    const checkWindowWidth = () => {
        setStackStatus(false);
        if (window.innerWidth <= 768) {
            setStackStatus(true);
        }
    }

    useEffect(() => {
        setModels(props.models);
        if (props.api) {
            setTotalRecords(props.totalRecords);
        }

        switch (props.actionStatus) {
            case "edit":
                setActionWidth({ minWidth: "1rem", width: "5%" });
                break;
            case "crud":
                setActionWidth({ minWidth: "7rem", width: "10%" });
                break;
            default:
                break;
        }

        checkWindowWidth();
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {
                props.filterStatus ?
                    <Panel header="Filter By" className="mb-2">
                        { props.filterDynamic }
                    </Panel>
                : ""
            }

            <div className="datatable-style">
            {
                props.api ?
                    props.tableType === "rowgroup" ?
                        <DataTable key="table-api" size="small" ref={dt} dataKey="id" header={headerTable} value={models}
                            responsiveLayout="scroll" scrollable scrollHeight={heightString}
                            selection={props.selection} onSelectionChange={props.setSelectionChange}
                            lazy={true} paginator={isNaN(props.paginator) ? true : props.paginator} first={first} rows={props.rows} paginatorTemplate={paginationTemplate} onPage={onPageCustom} totalRecords={totalRecords}
                            stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                            rowGroupMode="subheader" sortMode="single" sortOrder={1} groupRowsBy={props.rowGroupField} sortField={props.rowGroupField}
                            rowGroupHeaderTemplate={onRowGroupHeaderTemplate} rowGroupFooterTemplate={onRowGroupFooterTemplate}>
                            {
                                props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                            }
                            {dynamicColumns}
                        </DataTable>
                    :  props.tableType === "expand" ?
                            <DataTable key="table-api" size="small" ref={dt} dataKey="id" header={headerTable} value={models}
                                responsiveLayout="scroll" scrollable scrollDirection="both" scrollHeight={heightString}
                                selection={props.selection} onSelectionChange={props.setSelectionChange}
                                lazy={true} paginator={isNaN(props.paginator) ? true : props.paginator} first={first} rows={props.rows} paginatorTemplate={paginationTemplate} onPage={onPageCustom} totalRecords={totalRecords}
                                stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={onRowExpansionTemplate}
                            >
                                {
                                    props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                }
                                <Column expander style={{ width: '5%' }} />
                                {dynamicColumns}
                            </DataTable>
                        :
                            stackStatus ?
                                <DataTable key="table-api" size="small" ref={dt} dataKey="id" header={headerTable} value={models} responsiveLayout="stack"
                                    selection={props.selection} onSelectionChange={props.setSelectionChange}
                                    lazy={true} paginator={isNaN(props.paginator) ? true : props.paginator} first={first} rows={props.rows} paginatorTemplate={paginationTemplate} onPage={onPageCustom} totalRecords={totalRecords}
                                    stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                                >
                                    {
                                        props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                    }
                                    {dynamicColumns}
                                </DataTable>
                            :
                                <DataTable key="table-api" size="small" ref={dt} dataKey="id" header={headerTable} value={models}
                                    responsiveLayout="scroll" scrollable scrollDirection="both" scrollHeight={heightString}
                                    selection={props.selection} onSelectionChange={props.setSelectionChange}
                                    lazy={true} paginator={isNaN(props.paginator) ? true : props.paginator} first={first} rows={props.rows} paginatorTemplate={paginationTemplate} onPage={onPageCustom} totalRecords={totalRecords}
                                    stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                                >
                                    {
                                        props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                    }
                                    {dynamicColumns}
                                </DataTable>

                :
                    props.tableType === "rowgroup" ?
                        <DataTable key="table-api" size="small" ref={dt} dataKey="id" header={headerTable} value={models} globalFilter={globalFilter}
                            responsiveLayout="scroll" scrollable scrollHeight={heightString}
                            paginator={isNaN(props.paginator) ? true : props.paginator} rows={props.rows} rowsPerPageOptions={[5, 10, 20, 50]}
                            selection={props.selection} onSelectionChange={props.setSelectionChange}
                            stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                            rowGroupMode="subheader" sortMode="single" sortOrder={1} groupRowsBy={props.rowGroupField} sortField={props.rowGroupField}
                            rowGroupHeaderTemplate={onRowGroupHeaderTemplate} rowGroupFooterTemplate={onRowGroupFooterTemplate}
                        >
                            {
                                props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                            }
                            {dynamicColumns}
                        </DataTable>
                    :  props.tableType === "expand" ?
                            <DataTable key="table-api" size="small" ref={dt} dataKey="id" header={headerTable} value={models} globalFilter={globalFilter}
                                responsiveLayout="scroll" scrollable scrollDirection="both" scrollHeight={heightString}
                                paginator={isNaN(props.paginator) ? true : props.paginator} rows={props.rows} rowsPerPageOptions={[5, 10, 20, 50]}
                                selection={props.selection} onSelectionChange={props.setSelectionChange}
                                stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={onRowExpansionTemplate}
                            >
                                {
                                    props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                }
                                <Column expander style={{ width: '5%' }} />
                                {dynamicColumns}
                            </DataTable>
                        :
                            stackStatus ?
                                <DataTable key="table-standard" size="small" ref={dt} dataKey="id" header={headerTable} value={models} globalFilter={globalFilter} responsiveLayout="stack"
                                    paginator={isNaN(props.paginator) ? true : props.paginator} rows={props.rows} rowsPerPageOptions={[5, 10, 20, 50]}
                                    selection={props.selection} onSelectionChange={props.setSelectionChange}
                                    stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows} loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                                >
                                    {
                                        props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                    }
                                    {dynamicColumns}
                                </DataTable>
                            :
                                <DataTable key="table-standard" size="small" ref={dt} dataKey={props.dataKey === "undefined" ? "id" : props.dataKey} header={headerTable} value={models} globalFilter={globalFilter}
                                    scrollable scrollDirection="both" scrollHeight={props.scrollHeight ? props.scrollHeight : heightString} onRowDoubleClick={props.onRowDoubleClick} stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                                    paginator={isNaN(props.paginator) ? true : props.paginator} rows={props.rows} rowsPerPageOptions={[5, 10, 20, 50]} rowHover={true}
                                    selectionMode="checkbox" cellSelection={false} stateStorage="custom" customSaveState={props.onCustomSaveState} customRestoreState={props.onCustomRestoreState}
                                    selection={props.selection} onSelectionChange={props.setSelectionChange}
                                    loading={props.loading} emptyMessage="No data found." rowClassName={props.rowClassName} footerColumnGroup={props.footerColumnGroup}
                                >
                                    {
                                        props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false} frozen={true} />
                                    }
                                    {dynamicColumns}
                                </DataTable>
            }
            </div>
        </>
    )
});

export default DataTableCompCrud;
