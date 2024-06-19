import { CFormInput, CTable, CFormLabel, CCol, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster, CFormCheck, CImage} from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getBadge from '../badge';
import getstatus from '../status';

const QrCodeADD = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [user, setUser] = useState({
        user_id: "",
        user_name: "",
        email: "",
        phone: "",
        is_partner: true
    });

    const [userList, setUserList] = useState([]);

    const [qrCodeList, setQrCodeList] = useState([]);

    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [noOfQrcode, setNoOfQrcode] = useState(0);

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
                if (error.response.data.response_status == 401) {
                    localStorage.removeItem("user");
                    navigate('/login');
                    window.location.reload();
                }
                return message;
            }
        );
    };

    const createQrCode = () => {
        var body = {"user_ids": selectedUserIds, "no_of_qrcode": noOfQrcode};
        return userService.createQrCode(body).then(
            (data) => {
                setQrCodeList(data.data.response_data)
                addToast(ToastMessage('Created Successfully !!', 'primary'));
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

    const handleMapping = () => {
        if(noOfQrcode > 10){
            addToast(ToastMessage('Max 10 QR code allwoed !!', 'danger'))
        } else if(selectedUserIds.length != 1){
            addToast(ToastMessage('Please select One user !!', 'danger'))
        } else{
            createQrCode();
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

    const onChangeNoOfQrCode = (e) => {
        setNoOfQrcode(e.target.value);
    };

    const handleCheckboxChangeUser = (event) => {
        const checkedId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedUserIds([...selectedUserIds, checkedId])
        } else {
            setSelectedUserIds(selectedUserIds.filter(id => id !== checkedId))
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

    const QrcodeColumns = [
        {
            key: 'id',
            label: '#',
        },
        {
            key: 'key',
            label: 'QR Key',
        },
        {
            key: 'path',
            label: 'path',
        },
        {
            key: 'description',
            label: 'Descriptiom',
        },
        {
            key: 'status',
            label: 'Status',
        },
    ];


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

                                        <CFormCheck key={key} id={"key" + val.id} value={val.id} checked={selectedUserIds.includes(val.id)} onChange={(event) => { handleCheckboxChangeUser(event) }} />

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

    const renderQrDatadata = () => {
        if (qrCodeList.length > 0) {
            return (
                <CTable responsive hover >
                    <CTableHead>
                        <CTableRow>
                            {QrcodeColumns.map((val, key) => {
                                return (
                                    <CTableHeaderCell key={key}>{val.label}</CTableHeaderCell>
                                )
                            })}
                        </CTableRow>
                    </CTableHead>

                    <CTableBody>
                    {qrCodeList.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{(key + 1)}</CTableDataCell>
                                <CTableDataCell>{val.qr_key}</CTableDataCell>
                                <CTableDataCell><CImage rounded thumbnail src={val.image_dir_s3} width={200} height={200} /></CTableDataCell>
                                <CTableDataCell>{val.description}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(val.status)}>{getstatus(val.status)}</CBadge>
                                </CTableDataCell>
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
            <CFormLabel>Fetch Partner</CFormLabel>
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
                            <CFormInput type="text" id="email" key="email" placeholder='User Email' onChange={onChangeEmail} value={user.email} />
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
            <CTable responsive hover >
                <CTableHead>
                    <CTableRow className="mb-3">
                        <CTableDataCell sm={10}>
                            <CFormInput type="number" id="no_of_qr" label="No Of QR code (MAX 10)" max={10} min={0} onChange={onChangeNoOfQrCode}/>
                        </CTableDataCell>
                        <CTableDataCell sm={10}>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => handleMapping()}>
                                Submit
                            </CButton>
                        </CTableDataCell>
                    </CTableRow>
                </CTableHead>
            </CTable>
            {renderQrDatadata()}
        </>
    )
}

export default QrCodeADD
