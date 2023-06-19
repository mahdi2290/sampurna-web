import React, { Fragment, useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";

const MenubarComp = (props) => {
    const [items, setItems] = useState(null);
    let menu = [];

    useEffect(() => {
        switch (props.action) {
            case "list":
                menu = [
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Export",
                        icon: "pi pi-fw pi-download",
                        command: () => props.actionExport(),
                    },
                ];

                setItems(menu);
                break;
            case "new":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                ];

                setItems(menu);
                break;
                case "new-plant":
                    menu = [
                        {
                            label: "Refresh",
                            icon: "pi pi-fw pi-refresh",
                            command: () => props.actionButton("refresh"),
                        },
                        {
                            label: "New",
                            icon: "pi pi-fw pi-file",
                            command: () => props.actionButton("new"),
                        },
                    ];

                    setItems(menu);
                    break;
            case "crud":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-export":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Export",
                        icon: "pi pi-fw pi-download",
                        command: () => props.actionButton("download"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-update":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Update",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-refresh":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                ];

                setItems(menu);
                break;
            case "refresh-save":
                menu = [
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-confirm":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Confirm",
                        icon: "pi pi-fw pi-check-square",
                        command: () => props.actionButton("confirm"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-payroll-load":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Load Data",
                        icon: "pi pi-fw pi-database",
                        command: () => props.actionButton("load"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Export",
                        icon: "pi pi-fw pi-download",
                        command: () => props.actionExport(),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-payroll-refresh":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Export",
                        icon: "pi pi-fw pi-download",
                        command: () => props.actionExport(),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-sj-assign":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Assign",
                        icon: "pi pi-fw pi-sitemap",
                        command: () => props.actionButton("assign"),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-sj-cancel":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Save",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Cancel",
                        icon: "pi pi-fw pi-times-circle",
                        command: () => props.actionButton("cancel"),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-sj-close":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Close",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("close"),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "crud-sj-update-close":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                    {
                        label: "Update",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("save"),
                    },
                    {
                        label: "Close",
                        icon: "pi pi-fw pi-save",
                        command: () => props.actionButton("close"),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "back-new":
                menu = [
                    {
                        label: "Back",
                        icon: "pi pi-fw pi-chevron-left",
                        command: () => props.actionButton("back"),
                    },
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                ];

                setItems(menu);
                break;
            case "add":
                menu = [
                    {
                        label: "New",
                        icon: "pi pi-fw pi-file",
                        command: () => props.actionButton("new"),
                    },
                ];

                setItems(menu);
                break;
            case "refresh-print":
                menu = [
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "Print",
                        icon: "pi pi-fw pi-print",
                        command: () => props.actionButton("print"),
                    },
                ];

                setItems(menu);
                break;
            case "refresh":
                menu = [
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                ];

                setItems(menu);
                break;
            case "refresh-download":
                menu = [
                    {
                        label: "Refresh",
                        icon: "pi pi-fw pi-refresh",
                        command: () => props.actionButton("refresh"),
                    },
                    {
                        label: "Export",
                        icon: "pi pi-fw pi-download",
                        command: () => props.actionButton("download"),
                    },
                ];

                setItems(menu);
                break;
            default:
                break;
        }
    }, [props]);

    return (
        <Fragment>
            <Menubar model={items} className={props.className} />
        </Fragment>
    );
};

export default MenubarComp;
