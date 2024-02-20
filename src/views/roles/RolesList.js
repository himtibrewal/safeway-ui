import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';

const RoleList = () => {

  const [toast, addToast] = useState(0)

  const toaster = React.useRef()

  const navigate = useNavigate();

  const [role, setRole] = useState([])

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate('/login');
      window.location.reload();
    }
    fetchRoleList();
  }, [isLoggedIn]);

  const fetchRoleList = () => {
    return userService.getRoles().then(
      (data) => {
        console.log(data.data.response_data);
        //addToast(ToastMessage(data.data.response_message, 'primary'))
        setRole(data.data.response_data);
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

  const deleteRole = (index, role_id) => {
    return userService.deleteRole(role_id).then(
      (data) => {
        console.log(data.data.response_data);
        addToast(ToastMessage('Deleted Successfully !!', 'primary'));
        role.splice(index, 1);
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
        pathname: "/role/addEdit",
        search: createSearchParams({}).toString(),
      },
      { state: {} },
    );
  };

  const handleEdit = (role_id) => {
    navigate(
      {
        pathname: "/role/addEdit",
        search: createSearchParams({ id: role_id, edit: true }).toString(),
      },
      { state: {} },
    );
  };

  const handleDelete = (index, role_id) => {
    deleteRole(index, role_id)
    console.log("deleted" + role_id);
  };

  const columns = [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'role_name',
      label: 'Role Name',
    },
    {
      key: 'role_code',
      label: 'Role Code',
    },
    {
      key: 'permission',
      label: 'Role Permisison',
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
          {role.map((val, key) => {
            return (
              <CTableRow key={key}>
                <CTableDataCell>{key + 1}</CTableDataCell>
                <CTableDataCell>{val.role_name}</CTableDataCell>
                <CTableDataCell>{val.role_code}</CTableDataCell>
                {/* <CTableDataCell>{getPermission(val.permissions)}</CTableDataCell> */}
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

export default RoleList
