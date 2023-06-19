import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { Fragment, useState, useEffect } from 'react'
import { APIEmployeeAll } from '../../components/api/APIMaster';
import AutoCompleteComp from '../../components/standard/Form/AutoCompleteComp';
import InputSwitchComp from '../../components/standard/Form/InputSwitchComp';
import * as CrudHeader from '../../service/Fleet/FleetFormationService';

const FleetFormationInput = () => {
    const [models, setModels] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeSelect, setEmployeeSelect] = useState([]);

    const columnsTable = [
        { field: 'fleet_id.plate_no', header: 'No Plate', sortable: false, style: "percent", width: 10 },
        { field: 'driver_id.name', header: 'Nama Supir', sortable: false, style: "percent", width: 70, editor: true, },
    ];

    const getEmployee = async (keyword) => {
        const res = await APIEmployeeAll({keyword: keyword});

        setEmployeeData(null);

        return res;
    }

    const QueryData = async () => {
        const res = await CrudHeader.GetByID(1);

        if (res.status === 200) {
            const data = res.data;

            setModels(data.lists);
        }
    }

    const editorField = (options) => {
        return (
            <AutoCompleteComp className="col-6" api={true} validate={false} field="coor_id" title="" showField="name" models={employeeData}
                queryData={(e) => getEmployee(e)} value={employeeSelect} onChange={(e) => { setEmployeeSelect(e.value); options.editorCallback(e.value)}} />
        );
    }

    const checkboxField = (options) => {
        return (
            <InputSwitchComp className="col-12" validate={false} field="is_cash" title="" checked={options.value === 1 ? true : false} onChange={(e) => options.editorCallback(e.value)} />
        );
    }

    const onRowEditComplete = (e) => {
        let { newData, index } = e;

        let _before = [...models];
        _before[index].driver_id = newData['driver_id.name'];

        setModels(_before);
    };

    useEffect(() => {
        QueryData()
        setEmployeeData(null);
    }, [])

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <DataTable value={models} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} responsiveLayout="scroll">
                            <Column field="fleet_id.plate_no" header="No Polisi" style={{ width: '10%' }}></Column>
                            <Column field="fleet_status" header="Status" editor={(options) => checkboxField(options)} style={{ width: '20%' }}></Column>
                            <Column field="driver_id.name" header="Nama Supir" editor={(options) => editorField(options)} style={{ width: '20%' }}></Column>
                            <Column field="backup_id.name" header="Nama Serep" editor={(options) => editorField(options)} style={{ width: '20%' }}></Column>
                            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default FleetFormationInput
