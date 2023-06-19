import React, { Fragment, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const DataTableEditTableComp = (props) => {
    const [models, setModels] = useState(null);

    const onRowEditComplete = (e) =>{
        console.log(e);
    }

    const editorTemplate = (col, options) => {
        switch (col.editor) {
            case "textinput":
                return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
            case "dropdown":
                return (
                    <Dropdown value={options.value} options={props.optionsValue(col.field)} optionLabel="name" optionValue="name"
                        onChange={(e) => { options.editorCallback(e.value) }} placeholder="Select a Status"
                        itemTemplate={(option) => {
                            return <span className={`product-badge status-${option.name.toLowerCase()}`}>{option.name}</span>
                        }} />
                );
            default:
                break;
        }
    }

    let dynamicColumns = props.columnsTable.map((col) => {
        return <Column key={col.field} field={col.field} header={col.header} style={col.style} editor={(options) => editorTemplate(col, options)} />;
    });

    const headerTable = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{props.title}</h5>
        </div>
    );

    useEffect(() => {
        setModels(props.models);
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <DataTable editMode="row" dataKey="id" value={models} onRowEditComplete={onRowEditComplete} responsiveLayout="scroll" header={headerTable}>
                {dynamicColumns}
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </Fragment>
    )
}

export default DataTableEditTableComp;