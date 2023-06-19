import React, { Fragment } from "react";
import { Image } from 'primereact/image';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import DatePickerComp from "../../components/standard/Form/DatePickerComp";
import InputTextComp from "../../components/standard/Form/InputTextComp";
import InputTextAreaComp from "../../components/standard/Form/InputTextAreaComp";
import AutoCompleteComp from "../../components/standard/Form/AutoCompleteComp";
import InputSwitchComp from "../../components/standard/Form/InputSwitchComp";
import FileUploadComp from "../../components/standard/Form/FileUploadComp";
import InputNumberComp from "../../components/standard/Form/InputNumberComp";
import DropDownComp from "../../components/standard/Form/DropDownComp";
import Skorsing from "./Skorsing";

const EmployeeInformation = (props) => {    
    return (
        <Fragment>                    
            <form onSubmit={props.handleSubmit} autoComplete="off"> 
                
                <div className="card">
                    <TabView activeIndex={0}>
                        <TabPanel header="Informasi Karyawan">
                            <div className="grid mb-2">
                                <div className="col-12 md:col-4">
                                    <div className="card h-full">
                                        <h5>Foto Karyawan</h5>    
                                        <div className="round mb-3">
                                            <Image src={props.imagePreview} alt="Image" preview className="round-image"/>
                                        </div>
                                        <FileUploadComp multiple={false} onUpload={props.imageUpload} advanced={false} />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="card h-full">
                                        <div className="p-fluid grid">               
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="name" title="Nama Lengkap" value={props.values.name} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-6 sm:col-12" validate={true} field="nik" title="NIK" value={props.values.nik} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                                            
                                            <InputTextComp className="field col-12 md:col-6 sm:col-12" validate={true} field="alias" title="Alias" value={props.values.alias} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                
                                            <AutoCompleteComp className="field col-12 md:col-12 sm:col-12" api={true} filterName="name" validate={true} field="company_id" title="Grup Perusahaan" showField="name" models={props.companyData} queryData={(e) => props.onGetAutoCompleteQueryData("company", e)} 
                                                value={props.companyValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("company", e)} onChange={(e) => { props.onSetAutoCompleteSelect("company", e.value); props.setStatusValidate(true) }} 
                                                errors={props.errors} touched={props.touched} />
                                            <AutoCompleteComp className="field col-12 md:col-12 sm:col-12" api={true} validate={true} field="department_id" title="Department" showField="name" models={props.departmentData} queryData={(e) => props.onGetAutoCompleteQueryData("department", e)} 
                                                value={props.departmentValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("department", e)} onChange={(e) => { props.onSetAutoCompleteSelect("department", e.value); props.setStatusValidate(true) }} 
                                                errors={props.errors} touched={props.touched} />
                                            <AutoCompleteComp className="field col-12 md:col-12 sm:col-12" api={true} validate={true} field="division_id" title="Divisi" showField="name" models={props.divisionData} queryData={(e) => props.onGetAutoCompleteQueryData("division", e)} 
                                                value={props.divisionValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("division", e)} onChange={(e) => { props.onSetAutoCompleteSelect("division", e.value); props.setStatusValidate(true) }} 
                                                errors={props.errors} touched={props.touched} />
                                            <AutoCompleteComp className="field col-12 md:col-12 sm:col-12" api={true} validate={true} field="occupation_id" title="Jabatan" showField="name" models={props.positionData} queryData={(e) => props.onGetAutoCompleteQueryData("position", e)} 
                                                value={props.positionValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("position", e)} onChange={(e) => { props.onSetAutoCompleteSelect("position", e.value); props.setStatusValidate(true) }} 
                                                errors={props.errors} touched={props.touched} />                                  
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="card h-full">
                                        <div className="p-fluid grid">
                                            <InputSwitchComp className="field col-12 md:col-6 sm:col-12" validate={true} field="status" title="Aktif" checked={props.status} onChange={(e) => props.setStatus(e.value)} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <DropDownComp className="field col-12 md:col-12 sm:col-12" validate={true} field="status_employee" title="Status" optionLabel="name" optionValue="name" options={props.statusData} value={props.statusValue} errors={props.errors} touched={props.touched} onBlur={props.handleBlur} 
                                                onChange={(e) => { props.onSetAutoCompleteSelect("status", e.value); props.values.status_employee = e.value; props.setStatusValidate(true) }} />
                                            
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="pass_code" title="Passcode" value={props.values.pass_code} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        </div>
                                        <Panel header="Masa Kerja" className="h-full mt-3"> 
                                            <div className="p-fluid grid">
                                                <DatePickerComp className="field col-12 md:col-12 sm:col-12" validate={true} field="join_date" title="Tgl Masuk" value={props.values.join_date} onChange={(e) => { props.values.join_date = e; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                                <DatePickerComp className="field col-12 md:col-12 sm:col-12" validate={true} field="resign_date" title="Tgl Keluar" value={props.values.resign_date} onChange={(e) => { props.values.resign_date = e; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                                                                    
                                                <InputTextAreaComp className="field col-12 md:col-12 sm:col-12" validate={true} field="resign_memo" title="Alasan Keluar" value={props.values.resign_memo} rows={4} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Informasi Pribadi">
                            <div className="grid">
                                <div className="col-12 md:col-4">
                                    <Panel header="Data Pribadi" className="h-full">
                                        <div className="p-fluid grid">               
                                            <DropDownComp className="field col-12 md:col-12 sm:col-12" validate={true} field="sex" title="Jenis Kelamin" optionLabel="name" optionValue="name" options={props.sexData} value={props.sexValue} errors={props.errors} touched={props.touched} onBlur={props.handleBlur} 
                                                onChange={(e) => { props.onSetAutoCompleteSelect("sex", e.value); props.values.sex = e.value; props.setStatusValidate(true) }} />

                                            <DropDownComp className="field col-12 md:col-12 sm:col-12" validate={true} field="religion" title="Agama" optionLabel="name" optionValue="name" options={props.religionData} value={props.religionValue} errors={props.errors} touched={props.touched} onBlur={props.handleBlur} 
                                                onChange={(e) => { props.onSetAutoCompleteSelect("religion", e.value); props.values.religion = e.value; props.setStatusValidate(true) }} />

                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="place_of_birth" title="Tempat Lahir" value={props.values.place_of_birth} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                            
                                            <DatePickerComp className="field col-12 md:col-12 sm:col-12" validate={true} field="date_of_birth" title="Tgl Lahir" value={props.values.date_of_birth} onChange={(e) => { props.values.date_of_birth = e; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextAreaComp className="field col-12 md:col-12 sm:col-12" validate={true} field="living_address" title="Alamat Domisili" value={props.values.living_address} rows={4} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                            
                                            <AutoCompleteComp className="field col-12 md:col-12 sm:col-12" api={true} validate={true} field="city_id" title="Kota" showField="name" models={props.cityData} queryData={(e) => props.onGetAutoCompleteQueryData("city", e)} 
                                                value={props.cityValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("city", e)} onChange={(e) => { props.onSetAutoCompleteSelect("city", e.value); props.setStatusValidate(true) }} 
                                                errors={props.errors} touched={props.touched} />  
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="zip" title="ZIP" value={props.values.zip} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="phone" title="Telepon" value={props.values.phone} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                            
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="ktp" title="KTP" value={props.values.ktp} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="kartu_keluarga" title="KK" value={props.values.kartu_keluarga} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextAreaComp className="field col-12 md:col-12 sm:col-12" validate={true} field="ktp_address" title="Alamat KTP" value={props.values.ktp_address} rows={4} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                                                                        
                                        </div>
                                    </Panel>
                                </div>
                                <div className="col-12 md:col-4">
                                    <Panel header="Informasi NPWP" className="mb-3">
                                        <div className="p-fluid grid">               
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="npwp" title="NPWP" value={props.values.npwp} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                                
                                            <DropDownComp className="field col-12 md:col-12 sm:col-12" validate={true} field="npwp_status" title="NPWP Status" optionLabel="name" optionValue="name" options={props.npwpData} value={props.npwpValue} errors={props.errors} touched={props.touched} onBlur={props.handleBlur} 
                                                onChange={(e) => { props.onSetAutoCompleteSelect("npwp", e.value); props.values.npwp_status = e.value; props.setStatusValidate(true) }} />

                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="bpjs" title="BPJS Kesehatan" value={props.values.bpjs} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="bpjs_tk" title="BPJS TK" value={props.values.bpjs_tk} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                            
                                        </div>
                                    </Panel>
                                    <Panel header="Informasi Rekening">
                                        <div className="p-fluid grid">
                                            <AutoCompleteComp className="field col-12 md:col-12 sm:col-12" api={true} validate={true} field="bank_id" title="Bank" showField="name" models={props.bankData} queryData={(e) => props.onGetAutoCompleteQueryData("bank", e)} 
                                                value={props.bankValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("bank", e)} onChange={(e) => { props.onSetAutoCompleteSelect("bank", e.value); props.setStatusValidate(true) }} 
                                                errors={props.errors} touched={props.touched} />                                        
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="bank_no" title="Nomor Rekening" value={props.values.bank_no} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                        
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="bank_account_name" title="Nama Rekening" value={props.values.bank_account_name} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        </div>
                                    </Panel>
                                </div>
                                <div className="col-12 md:col-4">
                                    <Panel header="Informasi Keluarga" className="mb-3">
                                        <div className="p-fluid grid">
                                            <InputSwitchComp className="field col-12 md:col-4 sm:col-12" validate={true} field="marriage" title="Menikah" checked={props.marriage} onChange={(e) => props.setMarriage(e.value)} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="husband_wife_name" title="Nama Istri / Suami" value={props.values.husband_wife_name} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputNumberComp className="field col-12 md:col-12 sm:col-12" validate={true} field="children" title="Jumlah Anak" value={props.values.children} onChange={(e) => { props.values.children = e.value; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        </div>
                                    </Panel>
                                    <Panel header="Kontak Darurat Serumah" className="mb-3">
                                        <div className="p-fluid grid">
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="emergency_name" title="Nama Lengkap" value={props.values.emergency_name} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="emergency_phone" title="Telepon" value={props.values.emergency_phone} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="emergency_relation" title="Hubungan" value={props.values.emergency_relation} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        </div>
                                    </Panel>
                                    <Panel header="Kontak Darurat Tidak Serumah" className="mb-3">
                                        <div className="p-fluid grid">
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="emergency_inhouse_name" title="Nama Lengkap" value={props.values.emergency_inhouse_name} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="emergency_inhouse_phone" title="Telepon" value={props.values.emergency_inhouse_phone} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                            <InputTextComp className="field col-12 md:col-12 sm:col-12" validate={true} field="emergency_inhouse_relation" title="Hubungan" value={props.values.emergency_inhouse_relation} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        </div>
                                    </Panel>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="SIM">
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div className="p-fluid grid">
                                        <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={true} field="license_city_id" title="Kota" showField="name" models={props.licenseCityData} queryData={(e) => props.onGetAutoCompleteQueryData("license-city", e)} 
                                            value={props.licenseCityValue} setSelectValue={(e) => props.onSetAutoCompleteSelect("license-city", e)} onChange={(e) => { props.onSetAutoCompleteSelect("license-city", e.value); props.setStatusValidate(true) }} 
                                            errors={props.errors} touched={props.touched} />  

                                        <DropDownComp className="field col-12 md:col-12" validate={true} field="license_type" title="Jenis Lisensi" optionLabel="name" optionValue="name" options={props.licenseData} value={props.licenseValue} errors={props.errors} touched={props.touched} onBlur={props.handleBlur} 
                                            onChange={(e) => { props.onSetAutoCompleteSelect("license", e.value); props.values.license_type = e.value; props.setStatusValidate(true) }} />

                                        <InputTextComp className="field col-12 md:col-6 sm:col-12" validate={true} field="license_no" title="No Lisensi" value={props.values.license_no} onChange={props.handleChange} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        
                                        <DatePickerComp className="field col-12 md:col-6 sm:col-12" validate={true} field="license_issue_date" title="Tgl Dibuat" value={props.values.license_issue_date} onChange={(e) => { props.values.license_issue_date = e; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        <DatePickerComp className="field col-12 md:col-6 sm:col-12" validate={true} field="license_exp_date" title="Masa Berlaku" value={props.values.license_exp_date} onChange={(e) => { props.values.license_exp_date = e; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        
                                        <InputSwitchComp className="field col-12 md:col-6" validate={true} field="license_card" title="Kartu Lisensi" checked={props.card} onChange={(e) => { props.setCard(e.value); props.values.license_card = e.value ? 1 : 0 }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        <InputSwitchComp className="field col-12 md:col-6 sm:col-12" validate={true} field="license_on_hold" title="Lisensi Ditahan" checked={props.onHold} onChange={(e) => { props.setOnHold(e.value); props.values.license_on_hold = e.value ? 1 : 0 }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />
                                        
                                        <DatePickerComp className="field col-12 md:col-6 sm:col-12" validate={true} field="license_handover_date" title="Tgl Serah Terima" value={props.values.license_handover_date} onChange={(e) => { props.values.license_handover_date = e; }} onBlur={props.handleBlur} onInput={() => props.setStatusValidate(true)} errors={props.errors} touched={props.touched} />                                        
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Skorsing">
                            <Skorsing id={props.id} models={props.skorModels} emptyModel={props.emptySkorModel} setChangeStatus={() => props.setStatusValidate(true)} setToast={props.setToast} getData={props.getData}/>
                        </TabPanel>
                    </TabView>
                </div>
            </form>
        </Fragment>
    )
}

export default EmployeeInformation;