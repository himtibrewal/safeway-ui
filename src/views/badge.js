const getBadge = (status) => {
    switch (status) {
        case 0:
            return 'danger'
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
};

export default getBadge;

