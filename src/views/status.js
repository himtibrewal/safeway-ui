const getstatus = (status) => {
    switch (status) {
        case 0:
            return 'Inactive'
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

export default getstatus;