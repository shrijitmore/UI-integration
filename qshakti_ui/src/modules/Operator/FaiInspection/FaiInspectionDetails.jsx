import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Button,
  Paper,
  TableContainer,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility,
  Edit,
} from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ParameterWiseTable from "../RmInspection/ParameterWiseView";
import { useDispatch } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";
import {
  faiGetData,
  faiGetDeatils,
  FAIpoOrderList,
  fetchDropdown,
  inProcessGetData,
  inProcessGetDeatils,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import { data } from "autoprefixer";
import {
  getCommonHeaderStyles,
  getTableCellStyles,
} from "../../../utils/tableStyle";
import { hasPermission } from "../../../utils/permissions";
import { formatDateTime } from "../../../utils/commonDateFormat";
import CommonInprocessInspection from "../InprocessInspection/CommonInprocessInspection";
import CustomAutocomplete from "../InprocessInspection/CustomAutocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DateFilter from "../../Dashboard/DateFilter";
import { useNavigate } from "react-router-dom";
import {
  FAI_GETDATA_EXPORT_DATA,
  GET_PO_DROPDOWN_LIST,
  GET_RM_ITEMCODE_LIST,
  GET_RM_SECTION_LIST,
  IN_PROCESS_INSPECTION_LIST_FOR_VIEW,
  INPROCESS_GETDATA_EXPORT_DATA,
} from "../../../utils/endpoints";
import SearchAutocomplete from "../FilterSection/SearchAutocomplete";
import { apiDateRangeMap } from "../../Dashboard/config";
import dayjs from "dayjs";
import CustomPagination from "../common/CustomPagination";
import ExportDropdown from "../../../common/commonComponent/exportComponent/ExportDropdown";

export const renderCell = (value) => {
  const colors = [
    "#e74c3c", // red
    "#3498db", // blue
    "#2ecc71", // green
    "#9b59b6", // purple
    "#f39c12", // orange
    "#1abc9c", // teal
    "#d35400", // dark orange
    "#7f8c8d", // gray
    "#2980b9", // strong blue
    "#16a085", // strong teal
    "#c0392b", // strong red
  ];
  const randomIndex = Math.floor(Math.random() * colors.length); // 0 to 10
  const color = colors[randomIndex];
  const lightBg = `${color}23`;
  const darkBorder = color;

  return (
    <Box
      sx={{
        background: lightBg, // Light background
        // color: "#333", // Dark text
        color: `${darkBorder}`,
        px: 2,
        py: 0.5,
        borderRadius: "20px",
        // fontSize: "0.75rem",
        fontWeight: 500,
        // display: "inline-block",
        // minWidth: "60px",
        textAlign: "center",
        lineHeight: 1.5,
        border: `1px solid ${darkBorder}`, // Dark border
        // boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
      }}
    >
      {value}
    </Box>
  );
};
function FaiInspectionDetails() {
  const [isUpdated, setIsUpdated] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
  });

  const [itemCode, setItemCode] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);

  const navigate = useNavigate();
  const [optionsName, setOptionsName] = useState([]);
  const [optionsIo, setOptionsIo] = useState([]);
  const [optionsItem, setOptionsItem] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [data, setData] = useState([]);
  const [operationListById, setOperationListById] = useState({});
  const [editId, setEditId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [openOperationIndex, setOpenOperationIndex] = useState(null);
  const [activeView, setActiveView] = useState(""); // '' | 'parameter' | 'sample'
  const [inspectionData, setInspectionData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10); // ✅ define pageSize
  const [totalRecords, setTotalRecords] = useState(0); // ✅ define totalRecords

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
    setOpenOperationIndex(null);
  };

  const toggleOperation = (operationIndex) => {
    setOpenOperationIndex((prev) =>
      prev === operationIndex ? null : operationIndex
    );
  };
  const commonDateFormat = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const visibleRows =
    expandedRow === null ? inspectionData : [inspectionData[expandedRow]];
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let data = {
  //         po_no: selectedOrder?.order_number,
  //         section_name: selectedSection?.building_name,
  //         item_code: itemCode?.item_code,
  //         date_range: apiDateRangeMap[formData.dateRange] || null,
  //       };
  //       if (
  //         formData.dateRange === "custom" &&
  //         formData.fromDate &&
  //         formData.toDate
  //       ) {
  //         data.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
  //         data.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
  //       }

  //       const res = await dispatch(faiGetData(data)).unwrap();
  //       setInspectionData(res?.data);
  //     } catch (error) {
  //       console.error("Failed to fetch inspection data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [selectedOrder?.order_number, selectedSection, itemCode, formData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ⏳ Start loader

        let data = {
          po_no: selectedOrder?.order_number,
          section_name: selectedSection?.building_name,
          item_code: itemCode?.item_code,
          date_range: apiDateRangeMap[formData.dateRange] || null,
          page, // ✅ current page from state
          page_size: 10, // ✅ can make dynamic if needed
        };

        if (formData.dateRange === "custom") {
          data.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
          data.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
        }

        const res = await dispatch(faiGetData(data)).unwrap();
        setInspectionData(res?.data || []);
        setTotalPages(res?.total_pages || 0); // ✅ total pages
        setTotalRecords(res?.total || 0); // ✅ total records
        setLoading(false);
      } catch (error) {
        setInspectionData([]);

        console.error("Failed to fetch inspection data:", error);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Only run API when conditions are met
    if (formData.dateRange === "custom") {
      if (formData.fromDate && formData.toDate) {
        fetchData();
      }
    } else {
      fetchData();
    }
  }, [
    selectedOrder?.order_number,
    selectedSection,
    itemCode,
    formData,
    page,
    pageSize,
  ]);

  useEffect(() => {
    if (
      operationListById &&
      operationListById.order_number &&
      operationListById.item_code &&
      operationListById.operation
    ) {
      setLoading(true); // ⏳ Start loader

      dispatch(faiGetDeatils({ data: operationListById }))
        .unwrap()
        .then((response) => {
          setData(response.data);
          setLoading(false); // ✅ Stop loader
        })
        .catch((error) => {
          console.error("Error fetching details:", error);
        })
        .finally(() => {
          setLoading(false); // ✅ Stop loader
        });
    }
  }, [operationListById]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // keeps them apart
            mb: 1,
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.3rem",
              },
              color: "#1a237e",
              fontWeight: "bold",
              cursor: "pointer",
              mt: 1,
              mb: 1,
            }}
            onClick={() => navigate("/faiinspectiondetails")}
          >
            FAI Inspection Details
          </Typography>
          {/*          
          {(expandedRow == null || !editId) && (
            <ExportDropdown
              FilterHeaderKey={
                expandedRow == null
                  ? []
                  : !editId
                  ? [
                      "id",
                      "po_no",
                      "inspection_parameter_name",
                      "LSL",
                      "USL",
                      "inspection_frequency",
                      "sample_size",
                      "remarks",
                      "actual_readings",
                    ]
                  : [
                      "id",
                      "po_no",
                      "inspection_parameter_name",
                      "section_name",
                      "item_code",
                      "production_machine",
                      "qc_machine",
                      "operations", // add this
                    ]
              }
              // fetchUrl={
              //   editId == false
              //     ? IN_PROCESS_INSPECTION_LIST_FOR_VIEW
              //     : INPROCESS_GETDATA_EXPORT_DATA
              // }
              fetchUrl={!editId ? FAI_GETDATA_EXPORT_DATA : ""} // fetch only if editId is not set
              data={expandedRow == null ? [] : !editId ? data : []} // use passedData if editId exists
              fileName="Fai InspectionDetails Report"
            />
          )} */}
        </Box>

        {expandedRow == null && (
          <Grid item xs={12} md={9}>
            <Card elevation={2} sx={{ p: 2, mb: 1 }}>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                  <SearchAutocomplete
                    label="Section"
                    value={selectedSection}
                    searchKey="section"
                    onChange={(newValue) => setSelectedSection(newValue)} // ✅ reusable
                    apiThunk={(p) => dispatch(fetchDropdown(p))}
                    apiParams={{ url: GET_RM_SECTION_LIST }}
                    getOptionLabel={(o) => o?.order_no || ""}
                    options={optionsName}
                    setOptions={setOptionsName}
                    optionLabelKey="building_name"
                    optionValueKey="building_id"
                    // const [options, ] = useState([]);
                    datasearchId={"search-section_rm"}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SearchAutocomplete
                    label="Production Order No"
                    value={selectedOrder}
                    searchKey="po_no" // ✅ dynamic key
                    onChange={(newValue) => setSelectedOrder(newValue)}
                    // onChange={handleFieldChange(setSelectedOrder)} // ✅ reusable
                    apiThunk={(p) => dispatch(fetchDropdown(p))}
                    apiParams={{ url: GET_PO_DROPDOWN_LIST }}
                    options={optionsIo}
                    setOptions={setOptionsIo}
                    optionLabelKey="order_number"
                    optionValueKey="order_number"
                    datasearchId={"search-production-order-no_rm"}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <DateFilter setFormData={setFormData} formData={formData} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SearchAutocomplete
                    label="Item Code"
                    value={itemCode}
                    searchKey="item_code" // ✅ dynamic key
                    onChange={(newValue) => setItemCode(newValue)}
                    apiThunk={(p) => dispatch(fetchDropdown(p))}
                    apiParams={{ url: GET_RM_ITEMCODE_LIST }}
                    getOptionLabel={(o) => o?.order_no || ""}
                    options={optionsItem}
                    setOptions={setOptionsItem}
                    optionLabelKey="item_code" // dropdown text
                    optionValueKey="item_code"
                    datasearchId={"search-item_code_rm"}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}

        <Paper elevation={3} sx={{ p: 1, border: "1px solid #ccc" }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ border: "1px solid #ccc" }}>
              <TableHead>
                <TableRow>
                  {[
                    "Prod. Order No.",
                    "Date & Time",
                    "Section Name",
                    // "User Name",
                    "Item Code",
                    "Production Machine",
                    "QC Machine",
                    "Action",
                  ].map((label, i) => {
                    const shouldCenter = ["Item Code", "Action"].includes(
                      label
                    );
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          ...getCommonHeaderStyles({ center: shouldCenter }),
                          border: "1px solid #ccc", // ✅ column borders
                        }}
                      >
                        {label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={4}
                      >
                        <CircularProgress /> {/* MUI loader */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : visibleRows && visibleRows?.length > 0 ? (
                  visibleRows &&
                  visibleRows?.map((row, index) => {
                    const actualIndex =
                      expandedRow === null ? index : expandedRow;

                    return (
                      <React.Fragment key={actualIndex}>
                        <TableRow
                          hover
                          sx={{
                            "&:hover": {
                              backgroundColor: "#e3f2fd", // Or any color you want
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              ...getTableCellStyles({ center: false }),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {row?.po_no}
                          </TableCell>

                          <TableCell
                            sx={{
                              ...getTableCellStyles({ center: false }),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {formatDateTime(row?.created_at)}

                            {/* {commonDateFormat(row.created_at)} */}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...getTableCellStyles({ center: false }),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {row?.section_name}
                          </TableCell>
                          {/* <TableCell
                            sx={{
                              ...getTableCellStyles({ center: false }),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {row.user_name || "NA"}
                          </TableCell> */}
                          <TableCell
                            sx={{
                              ...getTableCellStyles(),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {renderCell(row?.item_code)}
                          </TableCell>

                          <TableCell
                            sx={{
                              ...getTableCellStyles({ center: false }),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {row?.production_machine}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...getTableCellStyles({ center: false }),
                              border: "1px solid #e0e0e0",
                              alignItems: "center",
                              verticalAlign: "middle",

                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {row?.qc_machine}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...getTableCellStyles({ center: true }),
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            {expandedRow === actualIndex ? (
                              <Button
                                onClick={() => toggleRow(actualIndex)}
                                startIcon={<VisibilityIcon />}
                                color="primary"
                                variant="outlined"
                                size="small"
                              >
                                Back to List
                              </Button>
                            ) : (
                              <IconButton
                                onClick={() => toggleRow(actualIndex)}
                              >
                                <KeyboardArrowUp />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>

                        {expandedRow === actualIndex && (
                          <TableRow>
                            <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                              <Collapse in timeout="auto" unmountOnExit>
                                <Box sx={{ borderTop: "1px solid #ccc" }}>
                                  <Table size="small">
                                    {openOperationIndex == null && (
                                      <TableHead>
                                        <TableRow>
                                          <TableCell
                                            sx={{ fontWeight: "bold" }}
                                          >
                                            Sr. No.
                                          </TableCell>
                                          <TableCell
                                            sx={{ fontWeight: "bold" }}
                                          >
                                            Operations
                                          </TableCell>
                                          <TableCell
                                            sx={{ fontWeight: "bold" }}
                                          >
                                            Action
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                    )}
                                    <TableBody>
                                      {row.operations.map((op, opIndex) =>
                                        openOperationIndex === null ||
                                        openOperationIndex === opIndex ? (
                                          <React.Fragment key={opIndex}>
                                            <TableRow>
                                              {openOperationIndex !==
                                                opIndex && (
                                                <>
                                                  <TableCell>
                                                    {opIndex + 1}.
                                                  </TableCell>
                                                  <TableCell>
                                                    {op.operation_name}
                                                  </TableCell>

                                                  <TableCell>
                                                    <Box
                                                      display="flex"
                                                      alignItems="center"
                                                      gap={1}
                                                    >
                                                      <IconButton
                                                        onClick={() => {
                                                          toggleOperation(
                                                            opIndex
                                                          );
                                                          setEditId("");
                                                          setOperationListById({
                                                            order_number:
                                                              row.po_no,
                                                            item_code:
                                                              row.item_code,
                                                            operation:
                                                              op.operation,
                                                          });
                                                        }}
                                                        size="small"
                                                        sx={{
                                                          bgcolor: "#e3f2fd",
                                                          "&:hover": {
                                                            bgcolor: "#bbdefb",
                                                          },
                                                          borderRadius: 1,
                                                        }}
                                                      >
                                                        <VisibilityIcon
                                                          color="primary"
                                                          fontSize="small"
                                                        />
                                                      </IconButton>
                                                      {hasPermission(
                                                        "faiInspectionDetails",
                                                        "create"
                                                      ) && (
                                                        <IconButton
                                                          onClick={() => {
                                                            toggleOperation(
                                                              opIndex
                                                            );
                                                            setEditId(
                                                              row.po_no
                                                            );
                                                            setOperationListById(
                                                              {
                                                                order_number:
                                                                  row.po_no,
                                                                item_code:
                                                                  row.item_code,
                                                                operation:
                                                                  op.operation,
                                                              }
                                                            );
                                                          }}
                                                          size="small"
                                                          sx={{
                                                            bgcolor: "#f3e5f5",
                                                            "&:hover": {
                                                              bgcolor:
                                                                "#e1bee7",
                                                            },
                                                            borderRadius: 1,
                                                          }}
                                                        >
                                                          <EditIcon
                                                            color="primary"
                                                            fontSize="small"
                                                          />
                                                        </IconButton>
                                                      )}
                                                    </Box>
                                                  </TableCell>
                                                </>
                                              )}
                                            </TableRow>

                                            {openOperationIndex === opIndex && (
                                              <TableRow
                                                style={{
                                                  padding: 0,
                                                  margin: 0,
                                                }}
                                              >
                                                <TableCell
                                                  style={{
                                                    padding: 0,
                                                    margin: 0,
                                                  }}
                                                  colSpan={3}
                                                >
                                                  <Box
                                                    sx={{ overflowX: "auto" }}
                                                  >
                                                    {" "}
                                                    {loading ? (
                                                      <Box
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        py={3}
                                                      >
                                                        <CircularProgress
                                                          size={30}
                                                        />
                                                      </Box>
                                                    ) : (
                                                      <ParameterWiseTable
                                                        keyName={"fai"}
                                                        LayoutKey={
                                                          Array.isArray(data) &&
                                                          data.length > 0
                                                            ? data[0]
                                                                ?.input_type
                                                            : "parameter"
                                                        }
                                                        setActiveView={
                                                          setOpenOperationIndex
                                                        }
                                                        isView={
                                                          editId ? false : true
                                                        }
                                                        operationList={data}
                                                        isEdit={editId}
                                                        isdata={true}
                                                        setIsUpdated={
                                                          setIsUpdated
                                                        } // now it's valid
                                                      />
                                                    )}
                                                  </Box>
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </React.Fragment>
                                        ) : null
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={4}
                      >
                        <NoDataFound />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {expandedRow == null && (
              <CustomPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1); // reset to first page when page size changes
                }}
              />
            )}
          </TableContainer>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default FaiInspectionDetails;
