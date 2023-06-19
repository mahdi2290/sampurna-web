import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { formatBoolen, formatCurrency } from "../../../helpers/FormatHelpers";
import EditButtonComp from "../Button/EditButtonComp";
import RemoveButtonComp from "../Button/RemoveButtonComp";
import { Panel } from "primereact/panel";
import { RadioButton } from "primereact/radiobutton";

const DataTableComp = forwardRef((props, ref) => {
    const [stackStatus, setStackStatus] = useState(false);

    const divRef = useRef(null);
    const dt = useRef(null);
    const targetRef = useRef();
    const [models, setModels] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [globalFilter, setGlobalFilter] = useState("");
    const [first, setFirst] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState("Press 'Enter' key to go to this page.");
    const [actionWidth, setActionWidth] = useState({ minWidth: "5rem", width: "3%" });
    const [expandedRows, setExpandedRows] = useState(null);

    let localModeStorage = localStorage.getItem("layoutMode");
    let scrollHeight = document.documentElement.clientHeight - 320;
    let heightString = scrollHeight.toString() + "px";
    let widthFinal = divRef.current ? divRef.current.offsetWidth : 0;
    let widthTotal = 0;
    let widthPercent = 0;

    useImperativeHandle(ref, () => ({
        actionExport() {
            dt.current.exportCSV();
        },
    }));

    const getAll = (page, rows, keyword) => {
        checkWindowWidth();
        props.GetAll(page, rows, keyword);
    };

    const onInputFilter = (e) => {
        // getAll(currentPage, props.rows, e);
    };

    // ====================== Function Search By Key Down =======================

    const onPageKeyDownSearch = (event) => {
        if (event.key === "Enter") {
            const keyword = event.target.value;
            console.log(keyword)
            getAll(currentPage, props.rows, keyword);
            setGlobalFilter(keyword);
        }
    };

    // const getAll = (page, rows, keyword) => {
    //     checkWindowWidth();
    //     props.GetAll(page, rows, keyword);
    // };

    const setLimit = (value) => {
        props.setPerPage(value);
    };

    // const onInputFilter = (e) => {
    //     getAll(currentPage, props.rows, e);
    // };

    //     const onPageKeyDownSearch = (event) => {
    //     if (event.key === 'Enter') {
    //         setGlobalFilter(event.target.value);
    //         if (props.globalStatus) {
    //             props.setGlobal(event.target.value);
    //         }
    //         const value = event.target.value;
    //         if (props.api) {
    //             getAll(1, value);
    //         }
    //     }
    // }

    // const onPageKeyDownSearch = (event) => {
    //     if (event.key === 'Enter') {
    //         if (props.keydown) {
    //             props.onKeyDownSearch();
    //         } else {
    //             props.setGlobal(event.target.value);
    //             getAll(currentPage, props.rows, event.target.value);
    //             // if (props.api) {
    //             //     onInputFilter(globalFilter);
    //             // }
    //         }
    //     }
    // }

    // const onPageKeyDownSearch = (event) => {
    //     if (event.key === "Enter") {
    //         if (props.keydown) {
    //             props.onKeyDownSearch();
    //         } else {
    //             if (props.api) {
    //                 getAll(currentPage, props.perPage, globalFilter);
    //             } else {
    //                 props.search(globalFilter);
    //             }
    //         }
    //     }
    // };

    const onPageKeyDown = (event, options) => {
        if (event.key === "Enter") {
            const page = parseInt(currentPage);
            if (page < 1 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            } else {
                const first = currentPage ? options.rows * (page - 1) : 0;

                setFirst(first);
                setPageInputTooltip("Press 'Enter' key to go to this page.");
            }

            getAll(page, props.perPage, globalFilter);
        }
    };

    const onInputGlobal = (e) => {
        checkWindowWidth();

        if (props.api) {
            onInputFilter(e.target.value);
        } else {
            setGlobalFilter(e.target.value);
        }
    };

    const onPageCustom = (event) => {
        setFirst(event.first);
        setCurrentPage(event.page + 1);
        setLimit(event.rows);

        getAll(event.page + 1, event.rows, globalFilter);
    };

    const onPageInputChange = (event) => {
        setCurrentPage(event.target.value);
    };

    const paginationTemplate = {
        PrevPageLink: (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { "p-disabled": true });

                return (
                    <span className={className} style={{ userSelect: "none" }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 },
                { label: 100, value: 100 },
                { label: 200, value: 200 },
                { label: "All", value: options.totalRecords },
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3" style={{ color: "var(--text-color)", userSelect: "none" }}>
                    Go to <InputText size="2" className="ml-1" value={currentPage} tooltip={pageInputTooltip} onKeyDown={(e) => onPageKeyDown(e, options)} onChange={onPageInputChange} />
                </span>
            );
        },
    };

    const headerTable = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center my-2">
            <div className="justify-content-start">
                <b>{props.title}</b>
            </div>
            <div className="justify-content-end">
                {props.search && (
                    <span className="block p-input-icon-left">
                        <i className="pi pi-search" />
                        {
                            props.keydown || props.api === false ? (
                                <InputText
                                    className="p-inputtext"
                                    autoFocus={props.keydown}
                                    type="search"
                                    onInput={(e) => {
                                        onInputGlobal(e);
                                    }}
                                    placeholder="Search..."
                                    onBlur={(e) => onInputGlobal(e)}
                                    onKeyDown={(e) => onPageKeyDownSearch(e)}
                                />
                            ) : (
                                // <InputText className="p-inputtext" type="search" onKeyDown={(e) => onPageKeyDownSearch(e)} onInput={(e) => { onInputGlobal(e) }} placeholder="Search..." onBlur={(e) => onInputGlobal(e)} />

                                <InputText
                                    className="p-inputtext"
                                    autoFocus={props.keydown}
                                    type="search"
                                    onInput={(e) => {
                                        onInputGlobal(e);
                                    }}
                                    placeholder="Search..."
                                    onKeyDown={(e) => onPageKeyDownSearch(e)}
                                />
                                // <InputText className="p-inputtext" autoFocus={props.keydown} type="search" placeholder="Search..." onKeyDown={(e) => onPageKeyDownSearch(e)} />
                            )

                            // <InputText className="p-inputtext" autoFocus={props.keydown} type="search" placeholder="Search..." onKeyDown={(e) => onPageKeyDownSearch(e)} />
                        }
                    </span>
                )}
            </div>
        </div>
    );

    const onActionButton = (rowData) => {
        switch (props.actionStatus) {
            case "radio":
                return (
                    <div className="actions">
                        <RadioButton value={rowData.id} name="city" onChange={(e) => props.setRadioSelect(e.value)} checked={rowData.id === props.radioSelect} />
                    </div>
                );
            case "edit":
                return (
                    <div className="actions">
                        <EditButtonComp label="" onClick={() => props.actionEdit(rowData)} />
                    </div>
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
    };

    const priceTemplate = (rowData, col) => {
        return formatCurrency(rowData[col.field]);
    };

    const formatBooleanTable = (rowData, col) => {
        return formatBoolen(rowData[col.field]);
    };

    const currency2Template = (rowData, col) => {
        return formatCurrency(rowData[col.field], 2);
    };

    const currency3Template = (rowData, col) => {
        return formatCurrency(rowData[col.field], 3);
    };

    const currency4Template = (rowData, col) => {
        return formatCurrency(rowData[col.field], 4);
    };

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

        let style;
        if (col.field === "action") {
            let widthPixel = (widthFinal * actionWidth.minWidth) / 100;
            widthTotal = widthTotal + widthPixel;
            widthPercent = widthPercent + actionWidth.minWidth;

            style = { minWidth: widthPixel + "px" };
            data = <Column key={col.field} header="Action" body={onActionButton} style={style}></Column>;
        } else {
            if (col.style === "percent") {
                if (widthFinal > 900 && widthFinal <= 1400) {
                  widthFinal = widthFinal - (widthFinal * (localModeStorage === "static" ? 0.026 : 0.014));
                }
                let widthPixel = (widthFinal * col.width) / 100;
                widthTotal += widthPixel;
                widthPercent += col.width;
                if (widthFinal <= 500) widthPixel *= 5;
                style = { flexGrow: 1, width: widthPixel + "%" };
              } 
            else if (col.style === "percentage") {
                // let widthPixel = (widthFinal * col.width) / 100;
                // console.log(col.width);
                style = {flexGrow:1, width : col.width + "%"}
            }
              
              else {
                style = col.width;
              }

            // if (col.style === "percent") {
            //     if (widthFinal > 900 && widthFinal <= 1400) {
            //         if (localModeStorage === "static") {
            //             widthFinal  = widthFinal - (widthFinal * .026);
            //         } else {
            //             widthFinal  = widthFinal - (widthFinal * .014);
            //         }
            //     }

            //     let widthPixel = (widthFinal * col.width) / 100;
            //     widthTotal = widthTotal + widthPixel;
            //     widthPercent = widthPercent + col.width;

            //     if (widthFinal <= 500) {
            //         widthPixel = widthPixel * 10;
            //     }

            //     style = { flexGrow: 1, width: widthPixel + "%" };
            //     // style={ flexGrow: 1, flexBasis: '160px' }
            // } else {
            //     style = col.width;
            // }

            if (col.editor) {
                data = <Column key={col.field} field={col.field} header={col.header} dataType={col.body} style={style} sortable={col.sortable} body={body} frozen={col.frozen} alignFrozen={col.alignFrozen} editor={(options) => props.editor(options)} onCellEditComplete={props.onCellEditComplete} />;
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
                <span className="image-text">
                    <b>{field.length === 1 ? data[field[0]] : data[field[0]][field[1]]}</b>
                </span>
            </React.Fragment>
        );
    };

    const onRowExpansionTemplate = (data) => {
        return props.rowExpansion(data);
    };

    const checkWindowWidth = () => {
        setStackStatus(false);
        if (window.innerWidth <= 768) {
            setStackStatus(true);
        }
    };

    useEffect(() => {
        setModels(props.models);
        if (props.api) {
            setTotalRecords(props.totalRecords);
        }

        switch (props.actionStatus) {
            case "edit":
                setActionWidth({ minWidth: 3 });
                break;
            case "crud":
                setActionWidth({ minWidth: 10 });
                break;
            default:
                break;
        }

        checkWindowWidth();
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    // console.log(widthPercent, widthFinal, widthTotal);

    return (
        <>
            {props.filterStatus ? (
                <Panel header="Filter By" className="mb-2">
                    {props.filterDynamic}
                </Panel>
            ) : (
                ""
            )}

            <div ref={divRef} className="datatable-style">
                {props.api ? (
                    props.tableType === "rowgroup" ? (
                        <DataTable
                            key="table-api"
                            size="small"
                            ref={dt}
                            dataKey="id"
                            header={headerTable}
                            value={models}
                            responsiveLayout="scroll"
                            scrollable
                            scrollHeight={heightString}
                            selectionMode="checkbox"
                            cellSelection={false}
                            selection={props.selection}
                            onSelectionChange={props.setSelectionChange}
                            onRowDoubleClick={props.onRowDoubleClick}
                            lazy={true}
                            paginator={isNaN(props.paginator) ? true : props.paginator}
                            first={first}
                            rows={props.rows}
                            paginatorTemplate={paginationTemplate}
                            onPage={onPageCustom}
                            totalRecords={totalRecords}
                            stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                            loading={props.loading}
                            emptyMessage="No data found."
                            rowClassName={props.rowClassName}
                            footerColumnGroup={props.footerColumnGroup}
                            rowGroupMode="subheader"
                            sortMode="single"
                            sortOrder={1}
                            groupRowsBy={props.rowGroupField}
                            sortField={props.rowGroupField}
                            rowGroupHeaderTemplate={onRowGroupHeaderTemplate}
                            rowGroupFooterTemplate={props.onRowGroupFooterTemplate}
                        >
                            {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                            {dynamicColumns}
                        </DataTable>
                    ) : props.tableType === "expand" ? (
                        <DataTable
                            key="table-api"
                            size="small"
                            ref={dt}
                            dataKey="id"
                            header={headerTable}
                            value={models}
                            responsiveLayout="scroll"
                            scrollable
                            scrollDirection="both"
                            scrollHeight={heightString}
                            selectionMode="checkbox"
                            cellSelection={false}
                            selection={props.selection}
                            onSelectionChange={props.setSelectionChange}
                            onRowDoubleClick={props.onRowDoubleClick}
                            lazy={true}
                            paginator={isNaN(props.paginator) ? true : props.paginator}
                            first={first}
                            rows={props.rows}
                            paginatorTemplate={paginationTemplate}
                            onPage={onPageCustom}
                            totalRecords={totalRecords}
                            stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                            loading={props.loading}
                            emptyMessage="No data found."
                            rowClassName={props.rowClassName}
                            footerColumnGroup={props.footerColumnGroup}
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={onRowExpansionTemplate}
                        >
                            {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                            <Column expander style={{ width: "5%" }} />
                            {dynamicColumns}
                        </DataTable>
                    ) : stackStatus ? (
                        <DataTable
                            key="table-api"
                            size="small"
                            ref={dt}
                            dataKey="id"
                            header={headerTable}
                            value={models}
                            responsiveLayout="stack"
                            selectionMode="checkbox"
                            cellSelection={false}
                            selection={props.selection}
                            onSelectionChange={props.setSelectionChange}
                            onRowDoubleClick={props.onRowDoubleClick}
                            lazy={true}
                            paginator={isNaN(props.paginator) ? true : props.paginator}
                            first={first}
                            rows={props.rows}
                            paginatorTemplate={paginationTemplate}
                            onPage={onPageCustom}
                            totalRecords={totalRecords}
                            stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                            loading={props.loading}
                            emptyMessage="No data found."
                            rowClassName={props.rowClassName}
                            footerColumnGroup={props.footerColumnGroup}
                        >
                            {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                            {dynamicColumns}
                        </DataTable>
                    ) : (
                        <DataTable
                            key="table-api"
                            size="small"
                            ref={dt}
                            dataKey="id"
                            header={headerTable}
                            value={models}
                            responsiveLayout="scroll"
                            scrollable
                            scrollDirection="both"
                            scrollHeight={heightString}
                            onRowDoubleClick={props.onRowDoubleClick}
                            selectionMode="checkbox"
                            cellSelection={false}
                            selection={props.selection}
                            onSelectionChange={props.setSelectionChange}
                            lazy={true}
                            paginator={isNaN(props.paginator) ? true : props.paginator}
                            first={first}
                            rows={props.rows}
                            paginatorTemplate={paginationTemplate}
                            onPage={onPageCustom}
                            totalRecords={totalRecords}
                            stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                            loading={props.loading}
                            emptyMessage="No data found."
                            rowClassName={props.rowClassName}
                            footerColumnGroup={props.footerColumnGroup}
                        >
                            {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                            {dynamicColumns}
                        </DataTable>
                    )
                ) : props.tableType === "rowgroup" ? (
                    <DataTable
                        key="table-api"
                        size="small"
                        ref={dt}
                        dataKey="id"
                        header={headerTable}
                        value={models}
                        responsiveLayout="scroll"
                        scrollable
                        scrollHeight={heightString}
                        onRowDoubleClick={props.onRowDoubleClick}
                        paginator={isNaN(props.paginator) ? true : props.paginator}
                        rows={props.rows}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        selection={props.selection}
                        onSelectionChange={props.setSelectionChange}
                        stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                        loading={props.loading}
                        emptyMessage="No data found."
                        rowClassName={props.rowClassName}
                        footerColumnGroup={props.footerColumnGroup}
                        rowGroupMode="subheader"
                        sortMode="single"
                        sortOrder={1}
                        groupRowsBy={props.rowGroupField}
                        sortField={props.rowGroupField}
                        rowGroupHeaderTemplate={onRowGroupHeaderTemplate}
                        rowGroupFooterTemplate={props.onRowGroupFooterTemplate}
                    >
                        {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                        {dynamicColumns}
                    </DataTable>
                ) : props.tableType === "expand" ? (
                    <DataTable
                        key="table-api"
                        size="small"
                        ref={dt}
                        dataKey="id"
                        header={headerTable}
                        value={models}
                        responsiveLayout="scroll"
                        scrollable
                        scrollDirection="both"
                        scrollHeight={heightString}
                        paginator={isNaN(props.paginator) ? true : props.paginator}
                        rows={props.rows}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        selection={props.selection}
                        onSelectionChange={props.setSelectionChange}
                        onRowDoubleClick={props.onRowDoubleClick}
                        stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                        loading={props.loading}
                        emptyMessage="No data found."
                        rowClassName={props.rowClassName}
                        footerColumnGroup={props.footerColumnGroup}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={onRowExpansionTemplate}
                    >
                        {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                        <Column expander style={{ width: "5%" }} />
                        {dynamicColumns}
                    </DataTable>
                ) : stackStatus ? (
                    <DataTable
                        key="table-standard"
                        size="small"
                        ref={dt}
                        dataKey="id"
                        header={headerTable}
                        value={models}
                        responsiveLayout="stack"
                        paginator={isNaN(props.paginator) ? true : props.paginator}
                        rows={props.rows}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        selection={props.selection}
                        onSelectionChange={props.setSelectionChange}
                        onRowDoubleClick={props.onRowDoubleClick}
                        stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                        loading={props.loading}
                        emptyMessage="No data found."
                        rowClassName={props.rowClassName}
                        footerColumnGroup={props.footerColumnGroup}
                    >
                        {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>}
                        {dynamicColumns}
                    </DataTable>
                ) : props.children ? (
                    <DataTable
                        key="table-standard"
                        size="small"
                        ref={dt}
                        dataKey={props.dataKey === "undefined" ? "id" : props.dataKey}
                        header={headerTable}
                        value={models}
                        scrollable
                        scrollDirection="both"
                        scrollHeight={props.scrollHeight ? props.scrollHeight : heightString}
                        onRowDoubleClick={props.onRowDoubleClick}
                        stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                        paginator={isNaN(props.paginator) ? true : props.paginator}
                        rows={props.rows}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        rowHover={true}
                        selectionMode="checkbox"
                        cellSelection={false}
                        stateStorage="custom"
                        customSaveState={props.onCustomSaveState}
                        customRestoreState={props.onCustomRestoreState}
                        selection={props.selection}
                        onSelectionChange={props.setSelectionChange}
                        tableStyle={{ width: localModeStorage !== "overlay" ? "67vw" : "67vw" }}
                        loading={props.loading}
                        emptyMessage="No data found."
                        rowClassName={props.rowClassName}
                        footerColumnGroup={props.footerColumnGroup}
                    >
                        {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false} frozen={true} />}
                        {dynamicColumns}
                    </DataTable>
                ) : (
                    <DataTable
                        key="table-standard"
                        size="small"
                        ref={dt}
                        dataKey={props.dataKey === "undefined" ? "id" : props.dataKey}
                        header={headerTable}
                        value={models}
                        scrollable
                        scrollDirection="both"
                        scrollHeight={props.scrollHeight ? props.scrollHeight : heightString}
                        onRowDoubleClick={props.onRowDoubleClick}
                        stripedRows={isNaN(props.stripedRows) ? true : props.stripedRows}
                        paginator={isNaN(props.paginator) ? true : props.paginator}
                        rows={props.rows}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        rowHover={true}
                        selectionMode="checkbox"
                        cellSelection={false}
                        stateStorage="custom"
                        customSaveState={props.onCustomSaveState}
                        customRestoreState={props.onCustomRestoreState}
                        selection={props.selection}
                        onSelectionChange={props.setSelectionChange}
                        loading={props.loading}
                        emptyMessage="No data found."
                        rowClassName={props.rowClassName}
                        footerColumnGroup={props.footerColumnGroup}
                    >
                        {props.checkbox && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false} frozen={true} />}
                        {dynamicColumns}
                    </DataTable>
                )}
            </div>
        </>
    );
});

export default DataTableComp;
