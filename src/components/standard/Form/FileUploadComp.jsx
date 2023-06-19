import React, { Fragment, useRef } from "react";
import { FileUpload } from 'primereact/fileupload';
import { Button } from "primereact/button";

const FileUploadComp = (props) => {
    const fileUploadRef = useRef()

    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};

    const onUpload = (e) => {
        props.onUpload(e);
        e.options.clear();
    }

    const onTemplateRemove = (file, callback) => {
        callback();
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;

        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center mr-3" style={{width: '80%'}}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={300} />
                </div>
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-3" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Image Here</span>
            </div>
        )
    }

    return (
        <Fragment>
            {
                props.advanced ?
                    <FileUpload ref={fileUploadRef} name="images[]" multiple={props.multiple} accept="image/*" customUpload={true} uploadHandler={onUpload}
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate} 
                        chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                :
                    <FileUpload mode="basic" name="images[]" accept="image/*" multiple={props.multiple} customUpload={true} uploadHandler={onUpload} auto chooseLabel="Upload Image"/>
            }
            

        </Fragment>
    )
}

export default FileUploadComp;