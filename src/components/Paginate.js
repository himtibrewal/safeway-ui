import { CPagination, CPaginationItem} from '@coreui/react';

const Paginate = (data) => {
    console.log(data);
    var page = data.page;
    var callback = data.handle;
        return (<CPagination size="lg" align='end' >
            <CPaginationItem onClick={() => handlePaginate(page.current_page - 1, callback)}>Previous</CPaginationItem>
            {renderPaginate(page, callback)}
            <CPaginationItem onClick={() => handlePaginate(page.current_page + 1, callback)}>Next</CPaginationItem>
        </CPagination>);
}

const renderPaginate = (page, callback) => {
    var isDisable = false;
    var isactive = false;
    return (
        Array.apply(0, Array(page.total_pages)).map(function (x, i) {
            var pageName = i + 1;
            if (i == page.current_page) {
                isactive = true;
            } else {
                isactive = false;
            }
            // if((page.current_page - 2) > i || (page.current_page + 2) <  i){
            //     console.log(i, page.current_page + 2)
                return <CPaginationItem key={'page' + i} active={isactive} disabled={isDisable} val={i} onClick={() => handlePaginate(i, callback)}>{pageName}</CPaginationItem>
            // }
            
        })
    );
}

const handlePaginate = (page_number, callback) => {
    callback(page_number);
}

export default Paginate
