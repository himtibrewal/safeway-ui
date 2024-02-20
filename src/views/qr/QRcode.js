import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';

const VehicletList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState([])

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        fetchVehicleList();
    }, [isLoggedIn]);

    const fetchVehicleList = () => {
        return userService.getVehicles().then(
            (data) => {
                console.log(data.data.response_data);
                setVehicle(data.data.response_data);
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

    const deleteVehicle = (index, vehicle_id) => {
        return userService.deleteVehiclet(vehicle_id).then(
            (data) => {
                console.log(data.data.response_data);
                addToast(ToastMessage('Deleted Successfully !!', 'primary'));
                vehicle.splice(index, 1);
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
                pathname: "/vehicle/addEdit",
                search: createSearchParams({}).toString(),
            },
            { state: { } },
        );
    };

    const handleEdit = (index, vehicle_id) => {
        navigate(
            {
                pathname: "/vehicle/addEdit",
                search: createSearchParams({ id: vehicle_id, edit: true }).toString(),
            },
            { state: vehicle[index] },
        );
    };

    const handleDelete = (index, vehicle_id) => {
        deleteVehicle(index, vehicle_id);
    };

    const columns = [
        {
            key: 'id',
            label: '#',
        },
        {
            key: 'registration_no',
            label: 'Registration Number',
        },
        {
            key: 'vehicle_type',
            label: 'Vehicle Type',
        },
        {
            key: 'brand',
            label: 'Brand',
        },
        {
            key: 'model',
            label: 'Model',
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
                    {vehicle.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{key + 1}</CTableDataCell>
                                <CTableDataCell>{val.registration_no}</CTableDataCell>
                                <CTableDataCell>{val.type}</CTableDataCell>
                                <CTableDataCell>{val.brand}</CTableDataCell>
                                <CTableDataCell>{val.model}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(val.status)}>{getstatus(val.status)}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton size="sm" color="primary" className="ml-1" onClick={() => handleEdit(key, val.id)}>
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

export default VehicletList
