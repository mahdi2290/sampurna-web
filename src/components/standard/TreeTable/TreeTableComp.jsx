import React, { Fragment, useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { classNames } from 'primereact/utils';
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Ripple } from 'primereact/ripple';
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { formatBoolen, formatCurrency } from "../../../helpers/FormatHelpers";
import EditButtonComp from "../Button/EditButtonComp";
import RemoveButtonComp from "../Button/RemoveButtonComp";
import { Panel } from "primereact/panel";

const TreeTableComp = forwardRef((props, ref) => {
    const dt = useRef(null)
    const [models, setModels] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [globalFilter, setGlobalFilter] = useState("");
    const [first, setFirst] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');
    const [actionWidth, setActionWidth] = useState({ minWidth: "5rem", width: "3%" })

    let scrollHeight = document.documentElement.clientHeight - 320;
    let heightString = scrollHeight.toString() + "px";

    useImperativeHandle(ref, () => ({
        actionExport() {
            dt.current.exportCSV();
        }
    }));

    const getAll = (page, rows, keyword) => {
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
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 },
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

    let dynamicColumns = props.columnsTable.map((col, i) => {
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
            data = <Column key={col.field} field={col.field} header={col.header} dataType={col.body} style={col.style} sortable={col.sortable} body={body} expander={i === 0 ? true : false} />;
        }

        return data;
    });

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
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            {
                props.filterStatus ?
                    <Panel header="Filter By" className="mb-2">
                        { props.filterDynamic }
                    </Panel>
                : ""
            }

            {
                props.api ?
                    <TreeTable key="tree-api" size="small" ref={dt} header={headerTable} value={models}
                        scrollable scrollHeight={heightString}
                        lazy={true} paginator={true} first={first} rows={props.rows} paginatorTemplate={paginationTemplate} onPage={onPageCustom} totalRecords={totalRecords}
                        loading={props.loading} emptyMessage="No data found."
                    >
                        {dynamicColumns}
                    </TreeTable>

                :
                    <TreeTable key="tree-standard" size="small" ref={dt} header={headerTable} value={models} globalFilter={globalFilter}
                        scrollable scrollHeight={heightString}
                        paginator={true} rows={props.rows == null ? 10 : props.rows} rowsPerPageOptions={[10, 20, 50]}
                        loading={props.loading} emptyMessage="No data found."
                    >
                        {dynamicColumns}
                    </TreeTable>
            }
        </Fragment>
    )
});

export default TreeTableComp;
