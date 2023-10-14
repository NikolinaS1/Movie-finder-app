import { Pagination } from "@mui/material";
import "./CustomPagination.css";

const CustomPagination = ({ setPage, numberOfPages = 10 }) => {
  const handlePageChange = (event, page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  return (
    <div className="pagination">
      <Pagination count={numberOfPages} onChange={handlePageChange} />
    </div>
  );
};

export default CustomPagination;
