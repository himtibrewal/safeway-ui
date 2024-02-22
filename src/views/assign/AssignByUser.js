import { CFormInput, CTable, CFormLabel, CCol, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster, CFormCheck } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';

const AssignByUser = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [user, setUser] = useState({
        user_id: "",
        user_name: "",
        email: "",
        phone: "",
    });

    const [vehicle, setVehicle] = useState({
        vehicle_id: "",
        reg_no: "",
    });

    const [userList, setUserList] = useState([]);

    const [vehicleList, setVehicleList] = useState([]);

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
    }, [isLoggedIn]);

    const fetchUser = () => {
        return userService.getUserByKey(user).then(
            (data) => {
                setUserList(data.data.response_data);
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'));
                return message;
            }
        );
    };

    const fetchVehicle = () => {
        return userService.getVehicleByKey(vehicle).then(
            (data) => {
                setVehicleList(data.data.response_data);
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'));
                return message;
            }
        );
    };

   
    const assignVehicle = () => {
        return userService.assignVehicle(selectedUserIds[0], selectedVehicleIds).then(
            (data) => {
                addToast(ToastMessage('Assigned Successfully !!', 'primary'));
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };

    const handleUserSearch = () => {
        if (user.email != '' || user.phone != '' || user.user_id != '' || user.user_name != '') {
            fetchUser();
        } else {
            addToast(ToastMessage('Please provide User input', 'danger'))
        }
    };

    const handleVehicleSearch = () => {
        if (vehicle.vehicle_id != '' || vehicle.reg_no != '') {
            fetchVehicle();
        } else {
            addToast(ToastMessage('Please provide vehicle input', 'danger'))
        }
    };

    const handleMapping = () => {
        if (selectedUserIds.length == 1  && selectedVehicleIds.length > 0) {
            assignVehicle();
        } else {
            addToast(ToastMessage('Please select One user and One Vehicle', 'danger'))
        }
    };

    const onChangeUserId = (e) => {
        setUser({ ...user, user_id: e.target.value, });
    };

    const onChangeUserName = (e) => {
        setUser({ ...user, user_name: e.target.value, });
    };

    const onChangeEmail = (e) => {
        setUser({ ...user, email: e.target.value, });
    };

    const onChangePhone = (e) => {
        setUser({ ...user, phone: e.target.value, });
    };

    const onChangeVechileId = (e) => {
        setVehicle({ ...vehicle, vehicle_id: e.target.value, });
    };

    const onChangeReg = (e) => {
        setVehicle({ ...vehicle, reg_no: e.target.value, });
    };

    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);

    const handleCheckboxChangeUser = (event) => {
        const checkedId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedUserIds([...selectedUserIds, checkedId])
        } else {
            setSelectedUserIds(selectedUserIds.filter(id => id !== checkedId))
        }
    }

    const handleCheckboxChangeVehicle = (event) => {
        const checkedId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedVehicleIds([...selectedVehicleIds, checkedId])
        } else {
            setSelectedVehicleIds(selectedVehicleIds.filter(id => id !== checkedId))
        }
    }



    const Usercolumns = [
        {
            key: 'select',
            label: '#',
        },
        {
            key: 'id',
            label: 'User Id',
        },
        {
            key: 'username',
            label: 'User Name',
        },
        {
            key: 'email',
            label: 'User Email',
        },
        {
            key: 'mobile',
            label: 'User contact',
        },
    ];

    const Vehiclecolumns = [
        {
            key: 'select',
            label: '#',
        },
        {
            key: 'id',
            label: 'Vehicle Id',
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
    ]


    const renderUserdata = () => {
        if (userList.length > 0) {
            return (
                <CTable responsive hover >
                    <CTableHead>
                        <CTableRow>
                            {Usercolumns.map((val, key) => {
                                return (
                                    <CTableHeaderCell key={key}>{val.label}</CTableHeaderCell>
                                )
                            })}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {userList.map((val, key) => {
                            return (
                                <CTableRow key={key}>
                                    <CTableDataCell>

                                    <CFormCheck key={key} id={"key"+val.id}  value={val.id} checked={selectedUserIds.includes(val.id)} onChange={(event) => { handleCheckboxChangeUser(event) }} />
                                
                                    </CTableDataCell>
                                    <CTableDataCell>{key + 1}</CTableDataCell>
                                    <CTableDataCell>{val.username}</CTableDataCell>
                                    <CTableDataCell>{val.email}</CTableDataCell>
                                    <CTableDataCell>{val.mobile}</CTableDataCell>
                                </CTableRow>
                            )
                        })}
                    </CTableBody>

                </CTable>
            );
        }
    };

    const renderVehicledata = () => {
        if (vehicleList.length > 0) {
            return (
                <CTable responsive hover >
                    <CTableHead>
                        <CTableRow>
                            {Vehiclecolumns.map((val, key) => {
                                return (
                                    <CTableHeaderCell key={key}>{val.label}</CTableHeaderCell>
                                )
                            })}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {vehicleList.map((val, key) => {
                            return (
                                <CTableRow key={key}>
                                    <CTableDataCell>
                                    <CFormCheck key={key} id={"key"+val.id}  value={val.id} checked={selectedVehicleIds.includes(val.id)} onChange={(event) => { handleCheckboxChangeVehicle(event) }} />
                                    </CTableDataCell>
                                    <CTableDataCell>{key + 1}</CTableDataCell>
                                    <CTableDataCell>{val.registration_no}</CTableDataCell>
                                    <CTableDataCell>{val.type}</CTableDataCell>
                                    <CTableDataCell>{val.brand}</CTableDataCell>
                                    <CTableDataCell>{val.model}</CTableDataCell>
                                </CTableRow>
                            )
                        })}
                    </CTableBody>

                </CTable>
            );
        }
    };


    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-center" />
            <CFormLabel>Fetch User</CFormLabel>
            <CTable responsive hover >
                <CTableHead>
                    <CTableRow className="mb-3">
                        <CTableHeaderCell sm={10}>
                            <CFormInput type="text" id="user_id" key="user_id" placeholder='User ID' onChange={onChangeUserId} value={user.user_id} />
                        </CTableHeaderCell>
                        <CTableHeaderCell sm={10}>
                            <CFormInput type="text" id="username" key="username" placeholder='User Name' onChange={onChangeUserName} value={user.user_name} />
                        </CTableHeaderCell>
                        <CTableHeaderCell sm={10}>
                            <CFormInput type="text" id="email" key="email" placeholder='User Phone' onChange={onChangeEmail} value={user.email} />
                        </CTableHeaderCell>
                        <CTableHeaderCell sm={10}>
                            <CFormInput type="text" id="phone" key="phone" placeholder='User Phone' onChange={onChangePhone} value={user.phone} />
                        </CTableHeaderCell>
                        <CTableHeaderCell>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => handleUserSearch()}>
                                Search
                            </CButton>
                        </CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
            </CTable>
            {renderUserdata()}
            <CFormLabel>Fetch Vehicle</CFormLabel>
            <CTable responsive hover >
                <CTableHead>
                    <CTableRow className="mb-3">
                        <CTableHeaderCell sm={10}>
                            <CFormInput type="text" id="vehicle_id" key="vechile_id" placeholder='Vehicle ID' onChange={onChangeVechileId} value={vehicle.vehicle_id} />
                        </CTableHeaderCell>
                        <CTableHeaderCell sm={10}>
                            <CFormInput type="text" id="reg_no" key="reg_no" placeholder='Vehicle Number' onChange={onChangeReg} value={vehicle.reg_no} />
                        </CTableHeaderCell>
                        <CTableHeaderCell>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => handleVehicleSearch()}>
                                Search
                            </CButton>
                        </CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
            </CTable>
            {renderVehicledata()}
            <CButton size="sm" color="danger" className="ml-1" onClick={() => handleMapping()}>
                Submit
            </CButton>
        </>
    )
}

export default AssignByUser
