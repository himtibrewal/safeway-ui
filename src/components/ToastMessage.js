import { CToast, CToastClose, CToastBody} from '@coreui/react';
const ToastMessage = (message, color) => {

    return (
        <CToast autohide={true} visible={true} color={color} delay={3000} className="text-white align-items-center">
            <div className="d-flex">
                <CToastBody>{message}</CToastBody>
                <CToastClose className="me-2 m-auto" white />
            </div>
        </CToast>
    )
}

export default ToastMessage
