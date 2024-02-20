import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';

const PermissionList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [permission, setPermission] = useState([])

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        fetchPermisisonList();
    }, [isLoggedIn]);

    const fetchPermisisonList = () => {
        return userService.getPermisisons().then(
            (data) => {
                console.log(data.data.response_data);
                //addToast(ToastMessage(data.data.response_message, 'primary'))
                setPermission(data.data.response_data);
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'));
                return message;
            }
        );
    };

    const deletePermission = (index, permission_id) => {
        return userService.deletePermisison(permission_id).then(
            (data) => {
                console.log(data.data.response_data);
                addToast(ToastMessage('Deleted Successfully !!', 'primary'));
                permission.splice(index, 1);
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };


    const handleAdd = () => {
        navigate(
            {
                pathname: "/permission/addEdit",
                search: createSearchParams({}).toString(),
            },
            { state: { id: 1, name: 'sabaoon' } },
        );
    };

    const handleEdit = (permission_id) => {
        navigate(
            {
                pathname: "/permission/addEdit",
                search: createSearchParams({ id: permission_id, edit: true }).toString(),
            },
            { state: { id: 1, name: 'sabaoon' } },
        );
    };

    const handleDelete = (index, permission_id) => {
        deletePermission(index, permission_id)
        console.log("deleted" + permission_id);
    };

    const columns = [
        {
            key: 'id',
            label: '#',
        },
        {
            key: 'permission_name',
            label: 'Permission Name',
        },
        {
            key: 'permission_code',
            label: 'Permission Code',
        },
        {
            key: 'description',
            label: 'Description',
        },
        {
            key: 'status',
            label: 'Status',
        },
        {
            key: 'Action',
            label: 'Action',
        },
    ]

    const getBadge = (status) => {
        switch (status) {
            case 1:
                return 'success'
            case 2:
                return 'secondary'
            case 3:
                return 'warning'
            case 4:
                return 'danger'
            default:
                return 'primary'
        }
    }

    const getstatus = (status) => {
        switch (status) {
            case 1:
                return 'Active'
            case 2:
                return 'Inactive'
            case 3:
                return 'Pending'
            case 4:
                return 'Banned'
            default:
                return 'primary'
        }
    };


    return (
        <>
            <CButton type="button" color="success" variant="outline" className="me-2" onClick={() => handleAdd()}>
                Add
            </CButton>
            <CToaster ref={toaster} push={toast} placement="top-center" />
            <CTable responsive hover >
                <CTableHead>
                    <CTableRow>
                        {columns.map((val, key) => {
                            return (
                                <CTableHeaderCell key={key}>{val.label}</CTableHeaderCell>
                            )
                        })}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {permission.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{key + 1}</CTableDataCell>
                                <CTableDataCell>{val.permission_name}</CTableDataCell>
                                <CTableDataCell>{val.permission_code}</CTableDataCell>
                                <CTableDataCell>{val.description}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(val.status)}>{getstatus(val.status)}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton size="sm" color="primary" className="ml-1" onClick={() => handleEdit(val.id)}>
                                        Edit
                                    </CButton>
                                    <CButton size="sm" color="danger" className="ml-1" onClick={() => handleDelete(key, val.id)}>
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        )
                    })}
                </CTableBody>

            </CTable>
        </>
    )
}

export default PermissionList
