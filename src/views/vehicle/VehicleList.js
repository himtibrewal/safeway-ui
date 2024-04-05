import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getBadge from '../badge';
import getstatus from '../status';
import Paginate from 'src/components/Paginate';

const VehicletList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState([])

    const [page, setPage] = useState({
        current_page: 0,
        total_items: 0,
        total_pages: 0,
        per_page: 0,
    })

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const permissions = useSelector((state) => state.auth.permissions);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        fetchVehicleList(true, 0);
    }, [isLoggedIn]);

    const fetchVehicleList = (paginated, page_number) => {
        return userService.getVehicles(paginated, page_number).then(
            (data) => {
                console.log(data.data.response_data);
                setVehicle(data.data.response_data);
                setPage({ ...page, current_page: data.data.current_page, total_items: data.data.total_items, total_pages: data.data.total_pages, per_page: data.data.per_page });
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
        return userService.deleteVehicle(vehicle_id).then(
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
            { state: {} },
        );
    };

    const handleEdit = (index, vehicle_id) => {
        navigate(
            {
                pathname: "/vehicle/addEdit",
                search: createSearchParams({ id: vehicle_id, edit: true }).toString(),
            },
            { state: {} },
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
            key: 'status',
            label: 'Status',
        },
        {
            key: 'Action',
            label: 'Action',
        },
    ];

    const handlePaginate = (page_number) => {
        if (page_number < 0 || page_number >= page.total_pages) {
            addToast(ToastMessage("Page Not Availble", 'danger'));
        } else {
            return fetchVehicleList(true, page_number);
        }
    }

    const paginateRender = () => {
        if (vehicle.length > 0) {
            return (<Paginate data={vehicle} page={page} handle={handlePaginate} />);
        }
    }

    const isAdd = () => {
        return !permissions.includes("ADD_VEHICLE");
    }

    const isEdit = () => {
        return !permissions.includes("EDIT_VEHICLE");
    }

    const isDelete = () => {
        return !permissions.includes("DELETE_VEHICLE");
    }



    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-center" />
            <CTable responsive hover >
                <CTableHead>
                    <CTableRow>
                        {columns.map((val, key) => {
                            if (key == columns.length - 1) {
                                return (
                                    <CTableHeaderCell key="add_button">
                                        <CButton type="button" color="success" variant="outline" disabled={isAdd()} onClick={() => handleAdd()}>
                                            Add
                                        </CButton>
                                    </CTableHeaderCell>
                                );
                            }
                            return (<CTableHeaderCell key={key}></CTableHeaderCell>);
                        })}
                    </CTableRow>
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
                                <CTableDataCell>{(page.current_page * page.per_page) + (key + 1)}</CTableDataCell>
                                <CTableDataCell>{val.registration_no}</CTableDataCell>
                                <CTableDataCell>{val.type}</CTableDataCell>
                                <CTableDataCell>{val.brand}</CTableDataCell>
                                <CTableDataCell>{val.model}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(val.status)}>{getstatus(val.status)}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton size="sm" color="primary" className="ml-1" disabled={isEdit()} onClick={() => handleEdit(key, val.id)}>
                                        Edit
                                    </CButton>
                                    <CButton size="sm" color="danger" className="ml-1" disabled={isDelete()}onClick={() => handleDelete(key, val.id)}>
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        )
                    })}
                </CTableBody>
            </CTable>
            {paginateRender()}
        </>
    )
}

export default VehicletList
