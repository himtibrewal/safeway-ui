import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';

const UserList = () => {

  const [toast, addToast] = useState(0)

  const toaster = React.useRef()

  const navigate = useNavigate();

  const [user, setUser] = useState([])

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate('/login');
      window.location.reload();
    }
    fetchUserList();
  }, [isLoggedIn]);

  const fetchUserList = () => {
    return userService.getusers().then(
      (data) => {
        console.log(data.data.response_data);
        setUser(data.data.response_data);
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

  const deleteUser = (index, user_id) => {
    return userService.deleteUser(user_id).then(
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
        pathname: "/user/addEdit",
        search: createSearchParams({}).toString(),
      },
      { state: {} },
    );
  };

  const handleEdit = (user_id) => {
    navigate(
      {
        pathname: "/user/addEdit",
        search: createSearchParams({ id: user_id, edit: true }).toString(),
      },
      { state: {} },
    );
  };

  const handleDelete = (index, user_id) => {
    deleteRole(index, user_id)
    console.log("deleted" + user_id);
  };

  const columns = [
    {
      key: 'id',
      label: '#',
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
    // {
    //   key: 'roles',
    //   label: 'User Roles',
    // },
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

  const getroles = (value) => {
    //let arr = [...value];   //creating the copy
    console.log(value);
    return value.map(({ role_code }) => `${role_code}`).join(' | ');
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
          {user.map((val, key) => {
            return (
              <CTableRow key={key}>
                <CTableDataCell>{key + 1}</CTableDataCell>
                <CTableDataCell>{val.username}</CTableDataCell>
                <CTableDataCell>{val.email}</CTableDataCell>
                <CTableDataCell>{val.mobile}</CTableDataCell>
                {/* <CTableDataCell>{getroles(val.roles)}</CTableDataCell> */}
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

export default UserList
