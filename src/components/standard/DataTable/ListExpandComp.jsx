import React, { Fragment, useState, useEffect, useRef } from "react";
import { classNames } from 'primereact/utils';
import { Ripple } from 'primereact/ripple';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const ListExpandComp = (props) => {
    const dt = useRef(null)
    const isMounted = useRef(false);

    const [models, setModels] = useState(null);
    const [rowTotal, setRowTotal] = useState(0);

    const [globalFilter, setGlobalFilter] = useState("");
    const [first, setFirst] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');
    const [expandedRows, setExpandedRows] = useState(null);
    const [widthAction, setWidthAction] = useState(null);

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const actionWith = () => {
        let localModeStorage = localStorage.getItem("layoutMode");

        if (localModeStorage === "static") {
            setWidthAction({ width: "15%"});
        } else {
            setWidthAction({ width: "12%"});
        }
    }

    const onPageInputKeyDown = (event, options) => {
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

            props.getAll(page, props.perPage, globalFilter);
        }
    }

    const onCustomPage = (event) => {
        setFirst(event.first);
        setCurrentPage(event.page + 1);
        props.setPerPage(event.rows);

        props.getAll(event.page + 1, event.rows, globalFilter);
    }

    const onPageInputChange = (event) => {
        setCurrentPage(event.target.value);
    }

    const onInputFilter = (e) => {
        props.getAll(currentPage, props.perPage, e)
    }

    const onRowExpand = (event) => {

    }

    const onRowCollapse = (event) => {

    }

    const rowExpansionTemplate = (data) => {
        return props.rowExpansion(data);
    }

    const expandAll = () => {
        let _expandedRows = {};
        models.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-info p-button-sm mr-2" onClick={props.actionNew} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help p-button-sm" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <div className="m-0">
                <h5 className="m-2">{props.title}</h5>
                <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="p-button-sm mr-2" />
                <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} className="p-button-sm" />
            </div>
            <span className="block p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => { setGlobalFilter(e.target.value); onInputFilter(e.target.value); }} placeholder="Search..." />
            </span>
        </div>
    );

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
                { label: 50, value: 50 }
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        'CurrentPageReport': (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText size="2" className="ml-1" value={currentPage} tooltip={pageInputTooltip}
                        onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange}/>
                </span>
            )
        }
    };

    const actionButtonTable = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => props.actionEdit(rowData)}/>
            </div>
        );
    }

    let dynamicColumns = props.columns.map((col) => {
        return <Column key={col.field} field={col.field} header={col.header} style={col.style} sortable={col.sortable}/>;
    });

    useEffect(() => {
        if (isMounted.current) {
            const summary = expandedRows !== null ? 'All Rows Expanded' : 'All Rows Collapsed';

            console.log(summary);
        }
    }, [expandedRows]);

    useEffect(() => {
        isMounted.current = true;
        actionWith();
        setModels(props.models);
        setRowTotal(props.totalRows);
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable size="small" ref={dt} value={models} header={header} globalFilter={globalFilter} paginator={true} paginatorTemplate={paginationTemplate}
                first={first} rows={props.perPage} onPage={onCustomPage} lazy={true} totalRecords={rowTotal} loading={props.loading} resizableColumns columnResizeMode="fit"
                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate} dataKey="id" >
                <Column expander style={{ width: '5%' }} />
                {dynamicColumns}
                <Column header="Actions" body={actionButtonTable} style={widthAction}></Column>
            </DataTable>
        </Fragment>
    )
}

export default ListExpandComp;
