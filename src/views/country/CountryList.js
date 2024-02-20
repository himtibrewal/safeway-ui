import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster, CPagination, CPaginationItem } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import authService from "src/services/auth.service";
import getstatus from '../status';
import getBadge from '../badge';
import Paginate from 'src/components/Paginate';

const CountryList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [country, setCountry] = useState([])

    const [page, setPage] = useState({
        current_page: 0,
        total_items: 0,
        total_pages: 0,
    })

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        fetchCountryList(true, page.current_page);
    }, [isLoggedIn]);

    const fetchCountryList = (paginated, current_page) => {
        return userService.getCountries(paginated, current_page).then(
            (data) => {
                setCountry(data.data.response_data);
                setPage({ ...page, current_page: data.data.current_page, total_items: data.data.total_items, total_pages: data.data.total_pages, });
            },
            (error) => {
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                if (error.response && error.response.status) {
                    authService.logout();
                }
                console.log(error)
                addToast(ToastMessage(message, 'danger'));
                return message;
            }
        );
    };

    const deleteCountry = (index, country_id) => {
        return userService.deleteCountry(country_id).then(
            (data) => {
                addToast(ToastMessage('Deleted Successfully !!', 'primary'));
                country.splice(index, 1);
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
                pathname: "/country/addEdit",
                search: createSearchParams({}).toString(),
            },
            { state: {} },
        );
    };

    const handleEdit = (country_id) => {
        navigate(
            {
                pathname: "/country/addEdit",
                search: createSearchParams({ id: country_id, edit: true }).toString(),
            },
            { state: {} },
        );
    };

    const handleDelete = (index, country_id) => {
        deleteCountry(index, country_id)
    };

    const columns = [
        {
            key: 'id',
            label: '#',
        },
        {
            key: 'country_name',
            label: 'Country Name',
        },
        {
            key: 'country_abbr',
            label: 'Country Abbr',
        },
        {
            key: 'country_code',
            label: 'Country Phone Code',
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
            return fetchCountryList(true, page_number);
        }
    }

    const paginateRender = () => {
        if (country.length > 0) {
            return (<Paginate data={country} page={page} handle={handlePaginate}/>);
        }
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
                                        <CButton type="button" color="success" variant="outline" onClick={() => handleAdd()}>
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
                    {country.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{(page.current_page) * Math.ceil(page.total_items / page.total_pages) + (key + 1)}</CTableDataCell>
                                <CTableDataCell>{val.country_name}</CTableDataCell>
                                <CTableDataCell>{val.country_abbr}</CTableDataCell>
                                <CTableDataCell>{val.country_code}</CTableDataCell>
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
            {paginateRender()}
        </>

    );
}

export default CountryList
