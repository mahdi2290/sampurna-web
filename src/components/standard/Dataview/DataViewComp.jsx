import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview'
import NewButtonComp from './../Button/NewButtonComp'
import ExportButtonComp from './../Button/ExportButtonComp'
import * as ExportHelper from "./../../../helpers/ExportHelper";
import { InputText } from 'primereact/inputtext';
import DropDownComp from '../Form/DropDownComp';
import { Button } from 'primereact/button';

const DataViewComp = forwardRef((props, ref) => {
    const [models, setModels] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [first, setFirst] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterSelect, setFilterSelect] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const rows = useRef(9);
    const dataview = useRef();

    const onPageKeyDownSearch = (event) => {
        if (event.key === 'Enter') {
            setGlobalFilter(event.target.value);
            if (props.globalStatus) {
                props.setGlobal(event.target.value);
            }
            const value = event.target.value;
            if (props.api) {
                getAll(1, value);
            }
        }
    }

    const getAll = (page, keyword) => {
        props.queryData(page, keyword);
    }

    const onInputGlobal = (e) => {
        // e.preventDefault();
        // const value = e.target.value;
        // setFilter(e.target.value);
        // setGlobalFilter(e.target.value);

        // if (props.api) {
        //     getAll(1, value);
        // }
    }

    const itemTemplate = (model, layout) => {
        if (!model) {
            return;
        }

        if (layout === 'list') return props.renderListItem(model);
        else if (layout === 'grid') return props.renderGridItem(model);
    };

    const onPage = (event) => {
        const page = event.page + 1
        const startIndex = event.first

        setFirst(startIndex);

        props.queryData(page, globalFilter);
    }

    const actionExport = () => {
        const dataExport = []

        for (let index = 0; index < props.models.length; index++) {
            const element = props.models[index];

            let field = {};
            Object.keys(element).map(key => {
                if (element[key] !== null) {
                    if (element[key].hasOwnProperty('name')) {
                        field[key] = element[key].name
                    } else {
                        field[key] = element[key]
                    }
                }
                return key;
            });

            dataExport.push(field)
        }

        ExportHelper.exportExcel(dataExport, props.title);
    }

    useEffect(() => {
        if (!props.api) {
            if (props.dropdownlist.length > 0) {
                setFilterSelect(props.dropdownlist[0])
            }
        }

        if (totalRecords !== props.totalRecords)  {
            setFirst(0);
        }

        setModels(props.models)
        setTotalRecords(props.totalRecords)
        setTotalPage(props.totalPage);
        rows.current = props.rows
    }, [props.models]); // eslint-disable-line react-hooks/exhaustive-deps


    const renderHeader = () => {
        return (
            <div className="grid grid-nogutter">
                <div className="col-6" style={{ textAlign: 'left' }}>
                    {
                        props.add && <NewButtonComp onClick={() => props.actionNew()}  />
                    }
                    <ExportButtonComp onClick={() => actionExport()}  />
                </div>
                <div className="col-6" style={{ textAlign: 'right' }}>
                    <div className="flex flex-column md:flex-row md:justify-content-end md:align-items-center">
                        {
                            props.search &&
                            <>
                                {
                                    !props.api && <DropDownComp className="p-dropdown-sm col-12 md:col-3" validate={false} field="filter" title="" optionLabel="name" optionValue="field" options={props.dropdownlist} value={filterSelect}
                                    onChange={(e) => { setFilterSelect(e.value); }} />
                                }
                                {
                                    props.filter &&
                                    <Button type="button" key="filterButton" className="p-button-text p-button-sm mr-2" onClick={() => props.actionFilter()} >
                                        <i className="pi pi-filter"></i>
                                        <span className="px-1" style={{marginTop: "3px"}}>{props.label}</span>
                                    </Button>
                                }
                                <div className="justify-content-end ml-2">
                                    <span className="block p-input-icon-left">
                                        <i className="pi pi-search" />
                                        <InputText className="p-inputtext" type="search" onKeyDown={(e) => onPageKeyDownSearch(e)} onInput={(e) => { onInputGlobal(e) }} placeholder="Search..." onBlur={(e) => onInputGlobal(e)} />
                                    </span>
                                </div>
                            </>
                        }
                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} className="ml-2"/>
                    </div>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div key="dataview" className="card">
            <DataView ref={dataview} value={models} lazy layout={layout} header={header} itemTemplate={itemTemplate} paginator={props.paginator} page={1}
            totalRecords={totalRecords} rows={rows.current} first={first} loading={props.loading} onPage={onPage} alwaysShowPaginator={true} />

            <div className="flex flex-row md:flex-row md:justify-content-center md:align-items-center mt-2">
                {models ? <> {models.length < rows.current ? totalRecords : totalPage * rows.current} dari {props.totalRecords} </> : ""}
            </div>
        </div>
    )
})

export default DataViewComp
