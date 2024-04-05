import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster, CImage } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getBadge from '../badge';
import getstatus from '../status';
import Paginate from 'src/components/Paginate';

const QrcodeList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [qrcode, setQrcode] = useState([])

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
        fetchQrCodeList(true, 0);
    }, [isLoggedIn]);

    const fetchQrCodeList = (paginated, page_number) => {
        return userService.getQrCodes(paginated, page_number).then(
            (data) => {
                setQrcode(data.data.response_data);
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

    const deleteQrCode = (index, qrcode_id) => {
        return userService.deleteQrCode(qrcode_id).then(
            (data) => {
                console.log(data.data.response_data);
                addToast(ToastMessage('Deleted Successfully !!', 'primary'));
                qrcode.splice(index, 1);
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
                pathname: "/qr/addEdit",
                search: createSearchParams({}).toString(),
            },
            { state: {} },
        );
    };

    const handleEdit = (index, qrcode_id) => {
        navigate(
            {
                pathname: "/qr/addEdit",
                search: createSearchParams({ id: qrcode_id, edit: true }).toString(),
            },
            { state: qrcode[index] },
        );
    };

    const handleDelete = (index, qrcode_id) => {
        deleteQrCode(index, qrcode_id);
    };

    const columns = [
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
        {
            key: 'Action',
            label: 'Action',
        },
    ];

    const handlePaginate = (page_number) => {
        if (page_number < 0 || page_number >= page.total_pages) {
            addToast(ToastMessage("Page Not Availble", 'danger'));
        } else {
            return fetchQrCodeList(true, page_number);
        }
    }

    const paginateRender = () => {
        if (qrcode.length > 0) {
            return (<Paginate data={qrcode} page={page} handle={handlePaginate} />);
        }
    }

    const isAdd = () => {
        return !permissions.includes("ADD_QR");
    }

    const isEdit = () => {
        return !permissions.includes("EDIT_QR");
    }

    const isDelete = () => {
        return !permissions.includes("DELETE_QR");
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
                    {qrcode.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{(page.current_page * page.per_page) + (key + 1)}</CTableDataCell>
                                <CTableDataCell>{val.qr_key}</CTableDataCell>
                                <CTableDataCell><CImage rounded thumbnail src={val.image_dir_s3} width={200} height={200} /></CTableDataCell>
                                <CTableDataCell>{val.description}</CTableDataCell>
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

export default QrcodeList
