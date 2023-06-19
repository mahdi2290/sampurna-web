// import styled from "styled-components";
// import React, { useRef, useState } from 'react';
// import { useFormik } from 'formik';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
// import * as AuthService from '../../service/AuthService';
// import PostPutValidationComp from '../standard/Validation/PostPutValidationComp';
// import { Dialog } from 'primereact/dialog';
// import DataTableComp from '../standard/DataTable/DataTableComp';
// import { APIPoolWithToken } from '../api/APIMaster';
// import { useHistory } from "react-router-dom";
// import { useEffect } from "react";

// const Login = () => {
//     const toast = useRef();
//     const token = useRef();
//     const data = useRef();
//     const [waiting, setWaiting] = useState(false);
//     const [visible, setVisible] = useState(false);
//     const [errorVisible, setErrorVisible] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [checked, setChecked] = useState(false);
//     const [isVisibleDialog, setIsVisibleDialog] = useState(false);
//     const [models, setModels] = useState([]);
//     const [radioSelect, setRadioSelect] = useState(1);
//     const history = useHistory();
//     const [background, setBackground] = useState("");


//     const onSubmited = async(values, actions) => {
//         const form = new FormData();
//         const email = values.email;
//         const password = values.password;

//         form.append('email', email);
//         form.append('password', password);

//         const result = await AuthService.doUserLogin(form);

//         if (result.status === 200) {
//             token.current = result.data.token;

//             data.current = result.data;

//             setWaiting(true);

//             getPool();
//             setIsVisibleDialog(true);

//             setWaiting(false);
//         } else if (result.status === 400) {
//             result.message.map((row) => {
//                 const field = row.field;
//                 const value = row.message;

//                 return actions.setFieldError(field, value);
//             });

//             toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
//         } else if (result.status === 401 || result.status === 403) {
//             toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });

//         } else if (result.status === 402) {
//             setErrorVisible(true);
//             setErrorMessage(result.message);
//         } else {
//             setErrorVisible(true);
//             setErrorMessage(result.message);
//         }
//     }

//     const {values, errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
//         initialValues: {
//             email: "",
//             password: "",
//         },
//         onSubmit: onSubmited,
//     })

//     const getPool = async(page, rows, keyword) => {
//         const res = await APIPoolWithToken(token.current, keyword);

//         setModels(res);

//         return res;
//     }

//     const hideDialog = () => {
//         setIsVisibleDialog(false);
//     }

//     const clickOK = () => {
//         AuthService.handleLoginSuccess(data.current, radioSelect);

//         history.push('/');
//     }

//     const dialogFooter = (
//         <>
//             <Button label="Ok" icon="pi pi-check" className="p-button-text p-button-sm" onClick={clickOK} />
//             <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-sm" onClick={hideDialog} />
//         </>
//     );

//     const columnsTable = [
//         { field: 'name', header: 'Pool', sortable: false, style: "fix", width: {width: "262px"}, widthClass: "text-right" },
//         { field: 'action', header: 'Action' },
//     ];

//     // useEffect(() => {
//     //     if (refresh) {
//     //         const rand =  Math.floor(Math.random() * (max - min + 1)) + min;
//     //         console.log(formatDateTimeString(new Date()), rand.toString())
//     //         background = "background-" + rand.toString();
//     //         setRefresh(false);
//     //     }
//     //     return () => clearTimeout(timer);
//     // }, [refresh]);

//     // let timer = setTimeout(() => setRefresh(true), delay * 1000);

//     useEffect(() => {
//         const min = 1;
//         const max = 5;
//         const rand =  Math.floor(Math.random() * (max - min + 1)) + min;
//         setBackground("background-" + rand.toString());
//     }, [background])

//     return (
//         <>
//             <div className={background}>
//                 <form onSubmit={handleSubmit} autoComplete='off'>
//                     <MainContainer>
//                         <WelcomeText>Welcome</WelcomeText>
//                         <SampurnaGroupText>Sampurna Group</SampurnaGroupText>
//                             <InputContainer>
//                                 <InputText id="email" type="text" placeholder="Email address" value={values.email} onChange={handleChange} onBlur={handleBlur} className={errors.email && touched.email ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"} style={{ padding: '1rem' }} />
//                                 <div className='mb-3'>{errors.email && touched.email && <small id="email-help" className="p-error">{errors.email}</small>}</div>

//                                 <InputText id="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} className={errors.password && touched.password ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"} style={{ padding: '1rem' }} />
//                                 <div className='mb-3'>{errors.password && touched.password && <small id="password-help" className="p-error">{errors.password}</small>}</div>

//                             </InputContainer>
//                             <ButtonContainer>
//                                 <Button type='submit' label="Sign In" className="w-full p-3 text-5xl" style={{backgroundColor: "#03217b", borderColor: "#03217b"}}></Button>
//                             </ButtonContainer>
//                         <HorizontalRule />
//                         <ForgotPassword>Forgot Password?</ForgotPassword>
//                     </MainContainer>
//                 </form>
//                 <Toast ref={toast} />
//                 <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} />

//                 <Dialog visible={isVisibleDialog} style={{width: '350px'}} header="Pool" modal className="p-fluid" footer={dialogFooter} resizable={false} onHide={hideDialog}>
//                     <DataTableComp tableType="list" api={true} toolbar={false} title="Pool" search={true} paginator={false}
//                         models={models} columnsTable={columnsTable} stripedRows={true} GetAll={getPool} actionStatus="radio" radioSelect={radioSelect} setRadioSelect={(e) => setRadioSelect(e)}
//                     />
//                 </Dialog>
//             </div>
//         </>
//     )
// }
// const MainContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   height: 80vh;
//   width: 30vw;
// //   background: rgba(255, 255, 255, 0.15);
//   background: rgba(209, 209, 209, 0.42);
//   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
//   backdrop-filter: blur(8.5px);
//   -webkit-backdrop-filter: blur(8.5px);
//   border-radius: 10px;
//   color: #000000;
//   text-transform: uppercase;
//   letter-spacing: 0.3rem;
//   @media only screen and (max-width: 320px) {
//     width: 80vw;
//     height: 90vh;
//     hr {
//       margin-bottom: 0.3rem;
//     }
//     h4 {
//       font-size: medium;
//     }
//   }
//   @media only screen and (min-width: 360px) {
//     width: 100vw;
//     height: 70vh;
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//     h4 {
//       font-size: medium;
//     }
//   }
//   @media only screen and (min-width: 411px) {
//     width: 80vw;
//     height: 50vh;
//     margin-left: 170px;
//   }
//   @media only screen and (min-width: 768px) {
//     width: 50vw;
//     height: 40vh;
//     margin-left: 170px;
//   }
//   @media only screen and (min-width: 1024px) {
//     width: 70vw;
//     height: 40vh;
//     margin-left: 170px;
//   }
//   @media only screen and (min-width: 1280px) {
//     width: 28vw;
//     height: 55vh;
//     margin-left: 170px;
//   }
// `;

// const WelcomeText = styled.h1`
//   margin: 3rem 0 0rem 0;
//   font-size: 4rem;
//   font-weight: bold;
// `;

// const SampurnaGroupText = styled.h2`
//   margin: 1rem 0 2rem 0;
//   letter-spacing: 0.1rem;
//   color: #000000;
//   font-size: 3rem;
// `;

// const InputContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
//   align-items: center;
//   height: 25%;
//   width: 80%;
// `;

// const ButtonContainer = styled.div`
//   margin: 1rem 0 1rem 0;
//   width: 80%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const HorizontalRule = styled.hr`
//   width: 90%;
//   height: 0.3rem;
//   border-radius: 0.8rem;
//   border: none;
//   background: linear-gradient(to right, #14163c 0%, #03217b 79%);
//   background-color: #ebd0d0;
//   margin: 1rem 0 1rem 0;
//   backdrop-filter: blur(25px);
// `;

// const ForgotPassword = styled.h4`
//   cursor: pointer;
//   margin: 3rem 0 0rem 0;
//   color: #ff0000;
//   font-size: 3rem;
//   font-weight: bold;
//   text-transform: camelcase;
// `;

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

// export default React.memo(Login, comparisonFn);
























//  {/* <div className={background}>
//   <div className={classNames('flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden')}>
//     <div className="flex flex-column align-items-center justify-content-center">
//       <div style={{ borderRadius: "58px", padding: "0.3rem", background: "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)" }}>
//         <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: "55px"}}>
//           <div className="text-center mb-5">
//             <div className="text-900 text-3xl font-medium mb-3">WELCOME</div>
//             <span className="text-600 font-medium">SAMPURNA GROUP</span>
//           </div>
//           <div className="car-container">
//             <Car />
//           </div>
//           <div>
//             <InputContainer>
//               <InputText
//                 id="email"
//                 type="text"
//                 placeholder="Email address"
//                 value={values.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.email && touched.email ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"}
//                 style={{ padding: "1rem" }}
//               />
//               <div className="mb-3">
//                 {errors.email && touched.email && (
//                   <small id="email-help" className="p-error">
//                     {errors.email}
//                   </small>
//                 )}
//               </div>

//               <InputText
//                 id="password"
//                 type="password"
//                 placeholder="Password"
//                 value={values.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.password && touched.password ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"}
//                 style={{ padding: "1rem" }}
//               />
//               <div className="mb-3">
//                 {errors.password && touched.password && (
//                   <small id="password-help" className="p-error">
//                     {errors.password}
//                   </small>
//                 )}
//               </div>
//             </InputContainer>
//             <ButtonContainer>
//               <Button type="submit" label="Sign In" className="w-full p-3 text-5xl" style={{ backgroundColor: "#03217b", borderColor: "#03217b" }}></Button>
//             </ButtonContainer>
//             <HorizontalRule />
//             <ForgotPassword>Forgot Password?</ForgotPassword>
//             <Toast ref={toast} />
//             <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} />

//             <Dialog visible={isVisibleDialog} style={{ width: "350px" }} header="Pool" modal className="p-fluid" footer={dialogFooter} resizable={false} onHide={hideDialog}>
//               <DataTableComp
//                 tableType="list"
//                 api={true}
//                 toolbar={false}
//                 title="Pool"
//                 search={true}
//                 paginator={false}
//                 models={models}
//                 columnsTable={columnsTable}
//                 stripedRows={
//             </div> */}

//             {/* <div className={background}>
//             <div className={classNames('flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden')}>
//     <div className="flex flex-column align-items-center justify-content-center">
//       <div style={{ borderRadius: "58px", padding: "0.3rem", background: "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)" }}>
//         <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: "55px"}}><div className="text-center mb-5">
//                                     <WelcomeText>Welcome</WelcomeText>
//                                     <SampurnaGroupText>Sampurna Group</SampurnaGroupText>
//                                 </div>
//                                 <div>
//                                     <InputContainer>
//                                         <InputText
//                                             id="email"
//                                             type="text"
//                                             placeholder="Email address"
//                                             value={values.email}
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             className={errors.email && touched.email ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"}
//                                             style={{ padding: "1rem" }}
//                                         />
//                                         <div className="mb-3">
//                                             {errors.email && touched.email && (
//                                                 <small id="email-help" className="p-error">
//                                                     {errors.email}
//                                                 </small>
//                                             )}
//                                         </div>

//                                         <InputText
//                                             id="password"
//                                             type="password"
//                                             placeholder="Password"
//                                             value={values.password}
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             className={errors.password && touched.password ? "p-inputtext-lg text-3xl w-full mb-1 p-invalid" : "p-inputtext-lg text-3xl w-full mb-3"}
//                                             style={{ padding: "1rem" }}
//                                         />
//                                         <div className="mb-3">
//                                             {errors.password && touched.password && (
//                                                 <small id="password-help" className="p-error">
//                                                     {errors.password}
//                                                 </small>
//                                             )}
//                                         </div>
//                                     </InputContainer>
//                                     <ButtonContainer>
//                                         <Button type="submit" label="Sign In" className="w-full p-3 text-5xl" style={{ backgroundColor: "#03217b", borderColor: "#03217b" }}></Button>
//                                     </ButtonContainer>
//                                     <HorizontalRule />
//                                     <ForgotPassword>Forgot Password?</ForgotPassword>
//                                     <Toast ref={toast} />
//                                     <PostPutValidationComp waitingDialog={waiting} validationVisible={visible} setValidationVisible={(e) => setVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} />

//                                     <Dialog visible={isVisibleDialog} style={{ width: "350px" }} header="Pool" modal className="p-fluid" footer={dialogFooter} resizable={false} onHide={hideDialog}>
//                                         <DataTableComp
//                                             tableType="list"
//                                             api={true}
//                                             toolbar={false}
//                                             title="Pool"
//                                             search={true}
//                                             paginator={false}
//                                             models={models}
//                                             columnsTable={columnsTable}
//                                             stripedRows={true}
//                                             GetAll={getPool}
//                                             actionStatus="radio"
//                                             radioSelect={radioSelect}
//                                             setRadioSelect={(e) => setRadioSelect(e)}
//                                         />
//                                     </Dialog>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div> */}

//             perbaikilah code berikut ini agar Datepicker dapat menunjukkan tanggal yang dipilih setelah kembali dari page edit
//             const DatePicker = (props) => {
//                 const next = (event) => {
//                     event.preventDefault();
//                     const e = document.getElementById('container');
//                     const width = e ? e.getBoundingClientRect().width : null;
//                     e.scrollLeft += width - 60;
//                 };

//                 const prev = (event) => {
//                     event.preventDefault();
//                     const e = document.getElementById('container');
//                     const width = e ? e.getBoundingClientRect().width : null;
//                     e.scrollLeft -= width - 60;
//                 };

//                 const primaryColor = props.color? (props.color.indexOf("rgb") > 0?props.color:hexToRgb(props.color)):'rgb(54, 105, 238)';

//                 const startDate = props.startDate || new Date();
//                 const lastDate = addDays(startDate, props.days || 90);

//                 let buttonzIndex = {zIndex: 2};
//                 let buttonStyle = {background: '#EEF2FF'};
//                 let Component = DateView;

//                 if (props.type === "month") {
//                     buttonzIndex = {zIndex: 5};
//                     Component = MonthView;
//                     buttonStyle = {background: '#EEF2FF', marginBottom: "5px"};
//                 }

//                 return (
//                     <div className={styles.container}>
//                         <div className={styles.buttonWrapper} style={buttonzIndex}>
//                             <button className={styles.button} style={buttonStyle} onClick={prev}>&lt;</button>
//                         </div>
//                         <Component {...props} primaryColor={primaryColor} startDate={startDate} lastDate={lastDate}/>
//                         <div className={styles.buttonWrapper} style={buttonzIndex}>
//                             <button className={styles.button} style={buttonStyle} onClick={next}>&gt;</button>
//                         </div>
//                     </div>
//                 )
//             }

//             export { DatePicker }


//             const CargoList = (props) => {
//             const selectedDay = (val) => {
//                 issueDateRef.current = val;
//                 setDate(val);

//                 if (activeIndex === 0) {
//                     QueryDataJadwal(page_schedule.current, globalSchedule);
//                 } else if (activeIndex === 1){
//                     QueryDataSuratJalan(page_delivery.current, globalDelivery);
//                 }
//             };
//             return (
//                 <Fragment>
//                     <Toast ref={toast} />
//                     <div className="grid">
//                         <div className="col-12">
//                             <div className="card">
//                                 <DatePicker
//                                     startDate={new Date('2023-03-01')}
//                                     days={365 * 3}
//                                     type="day"
//                                     selectDate={date}
//                                     getSelectedDay={selectedDay}
//                                     labelFormat={"MMMM yyyy"}
//                                     color={"#374e8c"} />

//                                 <div className="col-12 mt-2">
//                                     <Button type="button" key="filterButton" className="p-button-text" onClick={() => actionFilterDelivery()} >
//                                         <i className="pi pi-filter"></i>
//                                         <span className="px-1" style={{marginTop: "3px"}}>Filter</span>
//                                     </Button>
//                                     {
//                                         businessSelect ? <Chip label={businessSelect.name} className="mb-2 mr-2" /> : null
//                                     }
//                                     {
//                                         orderTypeSelect ? <Chip label={orderTypeSelect.name} className="mb-2 mr-2" /> : null
//                                     }
//                                     {
//                                         fleetTypeSelect ? fleetTypeSelect.map((row) => {
//                                             return <Chip label={row.name} className="mb-2 mr-2" />
//                                         }) : null
//                                     }
//                                     {
//                                         formationSelect ? formationSelect.map((row) => {
//                                             return <Chip label={row.name} className="mb-2 mr-2" />
//                                         }) : null
//                                     }
//                                     {
//                                         customerSelect ? <Chip label={customerSelect.name} className="mb-2 mr-2" /> : null
//                                     }
//                                     {
//                                         originSelect ? <Chip label={originSelect.name} className="mb-2 mr-2" /> : null
//                                     }
//                                     {
//                                         plantSelect ? <Chip label={plantSelect.name} className="mb-2 mr-2" /> : null
//                                     }
//                                     {
//                                         productSelect ? <Chip label={productSelect.name} className="mb-2 mr-2" /> : null
//                                     }
//                                     {
//                                         statusSelect ? <Chip label={statusSelect.data_name} className="mb-2 mr-2" /> : null
//                                     }
//                                 </div>

//                                 <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="mt-3">
//                                     <TabPanel header="Jadwal">
//                                         <DataViewComp title="Schedule" api={true} models={modelsSchedule} paginator={true} renderGridItem={renderGridItemJadwal} renderListItem={renderListItemJadwal} rows={rows.current} totalRecords={totalRecordsSchedule} totalPage={totalPageSchedule} queryData={getAllSchedule} search={true} globalStatus={true} setGlobal={(e) => setGlobalSchedule(e)} />
//                                     </TabPanel>
//                                     <TabPanel header="Surat Jalan">
//                                         <DataViewComp title="Surat Jalan" api={true} models={modelsDelivery} paginator={true} add={true} actionNew={actionNew} renderGridItem={renderGridItemSJ} renderListItem={renderListItemSJ} rows={rows.current} totalRecords={totalRecordsDelivery} totalPage={totalPageDelivery} queryData={getAllDelivery} search={true} globalStatus={true} setGlobal={(e) => setGlobalDelivery(e)} filter={false} actionFilter={actionFilterDelivery}/>
//                                     </TabPanel>
//                                 </TabView>
//                             </div>
//                         </div>
//                     </div>
//                     <Dialog visible={isVisibleFilterDelivery} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '30vw'}} header="Filter Surat Jalan" modal className="p-fluid" footer={dialogFooterDelivery} onHide={hideDialogDelivery}>
//                         <div className="grid">
//                             <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="business_id" title="Bisnis Unit" showField="name" models={businessData} queryData={(e) => getBusiness(e)} value={businessSelect} setSelectValue={(e) => setBusinessSelect(e)} onChange={(e) => { onChangeBusiness(e.value); }} />
//                             <AutoCompleteComp disabled={opened} className="field col-12 md:col-12" api={true} validate={false} field="order_type_id" title="Jenis Transaksi" showField="name" models={orderTypeData} queryData={(e) => getOrderType(e)} value={orderTypeSelect} setSelectValue={(e) => setOrderTypeSelect(e)} onChange={(e) => { setOrderTypeSelect(e.value); }} />
//                             <MultiSelectComp disabled={opened} className="field col-12 md:col-12" validate={false} field="fleet_type_id" title="Jenis Armada" optionLabel="code" showField="name" options={fleetTypeData} value={fleetTypeSelect} onChange={(e) => { setFleetTypeSelect(e.value); }} />
//                             <MultiSelectComp disabled={opened} className="field col-12 md:col-12" validate={false} field="formation_id" title="Formasi" optionLabel="code" showField="name" options={formationData} value={formationSelect} onChange={(e) => { setFormationSelect(e.value); }} />
//                             <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="customer_id" title="Pelanggan" showField="name" models={customerData} queryData={(e) => getCustomer(e)} value={customerSelect} setSelectValue={(e) => setCustomerSelect(e)} onChange={(e) => { setCustomerSelect(e.value); }} />
//                             <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="origin_id" title="Asal" showField="name" models={originData} queryData={(e) => getOrigin(e)} value={originSelect} setSelectValue={(e) => setOriginSelect(e)} onChange={(e) => { setOriginSelect(e.value); }} />
//                             <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="plant_id" title="Tujuan" showField="name" models={plantData} queryData={(e) => getPlant(e)} value={plantSelect} setSelectValue={(e) => setPlantSelect(e)} onChange={(e) => { setPlantSelect(e.value); }} />
//                             <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="product_id" title="Produk" showField="name" models={productData} queryData={(e) => getProduct(e)} value={productSelect} setSelectValue={(e) => setProductSelect(e)} onChange={(e) => { setProductSelect(e.value); }} />
//                             <AutoCompleteComp className="field col-12 md:col-12" api={true} validate={false} field="status_id" title="Status" showField="data_name" models={statusData} queryData={(e) => getStatus(e)} value={statusSelect} setSelectValue={(e) => setStatusSelect(e)} onChange={(e) => { setStatusSelect(e.value); }} />
//                         </div>
//                     </Dialog>

//                     <Dialog visible={isVisibleHistory} breakpoints={{'960px': '100vw', '640px': '100vw'}} style={{width: '80vw'}} header="History Surat Jalan" modal className="p-fluid" footer={dialogFooterHistory} onHide={hideDialogHistory}>
//                         <DataTableComp api={false} scrollable={false} scrollHeight="flex" title="History" models={modelHistory} search={true} columnsTable={columnsTableHistory} paginator={false} />
//                     </Dialog>
//                     <PostPutValidationComp waitingDialog={waiting}/>
//                 </Fragment>
//             )
//                                 }
