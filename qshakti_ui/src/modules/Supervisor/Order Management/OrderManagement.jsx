import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExportDropdown from "../../../common/commonComponent/exportComponent/ExportDropdown";
import CommonDataGrid from "../../../common/commonComponent/commonDataGrid/commonDataGrid";
import DeleteConfirmationPopup from "../../../common/commonComponent/deleteConfirmationPopup/deleteConfirmationPopup";
import CustomAutocomplete from "../../Operator/InprocessInspection/CustomAutocomplete";
import CreateOrderDialog from "./CreateOrderDialog";
import { columns } from "./config";
import { useDispatch } from "react-redux";
import {
  DeleteOrderManagemnt,
  getOrderManagemnt,
} from "../../../store/slices/orderManagement/orderManagementSlice";
import { showToast } from "../../../common/ShowToast";
import { POST_PUT_GET_DELETE_ORDER_MANAGEMENT } from "../../../utils/endpoints";
import { hasPermission } from "../../../utils/permissions";

export default function OrderManagemnt() {
  const dispatch = useDispatch();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getOrderManagemnt()).unwrap();
        setDataList(res?.data);
        setIsCreated(false);
      } catch (err) {
        console.error("Failed to fetch order management data:", err);
      }
    };

    fetchData();
  }, [dispatch, isCreated]);

  //   console.log(dataList);

  const openDialog = (mode, userInfo) => {
    setDialogMode(mode);
    setSelectedUserInfo(userInfo);
    setSelectedUserId(userInfo?.id);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        const id = selectedUserId;
        const res = await dispatch(DeleteOrderManagemnt(id)).unwrap();
        setSelectedUserId("");
        dispatch(getOrderManagemnt())
          .unwrap()
          .then((res) => {
            setDataList(res?.data);
          });

        showToast(res?.message, "success");
      } catch (error) {
        showToast(error?.message || "Failed to delete order.", "error");
      }
    }
    setDeleteModalOpen(false);
  };

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          // gap: 1,
          width: "100%",
          mb: 0,
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
            // mb: 1,
          }}
        >
          Order Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          {hasPermission("orderManagement", "edit") && (
            <Button
              sx={{ width: "100px" }}
              variant="contained"
              onClick={() => openDialog("create")}
              className="commonAdd"
            >
              <AddCircleOutlineIcon
                fontSize="small"
                sx={{ marginRight: "10px" }}
              />
              Create
            </Button>
          )}
          {hasPermission("orderManagement", "export") && (
            <ExportDropdown
              fetchUrl={POST_PUT_GET_DELETE_ORDER_MANAGEMENT}
              fileName="Order Management"
            />
          )}
        </Box>
      </Box>
      {/* Table Section */}
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
          borderRadius: 1,
          paddingX: 1,
          paddingY: 1,
          mt: 1,
        }}
      >
        <Box sx={{ height: "82vh", width: "100%", mt: 0 }}>
          <CommonDataGrid
            rows={dataList?.map((row, index) => ({
              ...row,
              sr_no: index + 1,
            }))}
            columns={columns({
              handleDeleteClick,
              openDialog,
            })}
            disableRowSelectionOnClick
            sx={{
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
              },
            }}
            getRowHeight={() => 80}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
            rowCount={dataList?.total || 0}
            paginationMode="client"
            enablePagination={true}
          />
        </Box>

        <CreateOrderDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          mode={dialogMode}
          userId={selectedUserId}
          setIsCreated={setIsCreated}
          editUserData={selectedUserInfo}
        />

        <DeleteConfirmationPopup
          open={deleteModalOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message="Are you sure you want to delete this user?"
        />
      </Box>
    </>
  );
}
