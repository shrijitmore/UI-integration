// hooks/useApiData.js
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDropdown } from "../../../store/slices/operator/CommonIOSectionSlice";

const useApiData = (endpoint) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const sanitizeEndpoint = (url) => {
    if (!url) return "";
    return url.replace(/upload\/?$/, ""); // removes trailing "upload/" if exists
  };

  useEffect(() => {
    if (!endpoint) return;

    const getData = async () => {
      setLoading(true);
      setError(null);
      setData([]); // 🧼 Clear data before fetching

      try {
        const result = await dispatch(
          fetchDropdown({
            url: sanitizeEndpoint(endpoint),
            params: { page, pageSize },
          })
        ).unwrap();

        setData(result?.data || []);
        setTotalRecords(result?.total || 0);
        setTotalPages(Math.ceil((result?.total || 0) / pageSize));
      } catch (err) {
        setError(err?.message || "Something went wrong");
        setData([]); // 🧼 Ensure data is empty on error
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [endpoint, page, pageSize, dispatch]);
  // 👈 re-fetch when page/pageSize changes

  //   return { data, setData, loading, error };
  return {
    data,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
  };
};

export default useApiData;
