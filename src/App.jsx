import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Vouchers from "./pages/Vouchers/Vouchers";
import Home from "./pages/Home/Home";
import AddVoucher from "./pages/Vouchers/AddVoucher";
import { useContext, useEffect } from "react";
import { StoreContext } from "./context/StoreContext";
import PopupConfirm from "./components/PopupConfirm/PopupConfirm";
import NoPermissionPage from "./pages/NoPermissionPage/NoPermissonPage";
import Page404 from "./pages/Page404/Page404";
import EditFood from "./pages/List/EditFood/EditFood";
import { useState } from "react";
import OrderDetail from "./pages/Orders/OrderDetail/OrderDetail";
import ManageUser from "./pages/ManageUser/ManageUser";

export default function App() {
  const { authenticationAdmin, popupConfirmState } = useContext(StoreContext);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await authenticationAdmin();

      setIsAdmin(result);
    };

    checkAdmin();
  }, []);

  return (
    <>
      {isAdmin ? (
        <div>
          {popupConfirmState.show ? (
            <PopupConfirm
              message={popupConfirmState.message}
              question={popupConfirmState.question}
              onConfirm={popupConfirmState.onConfirm}
              onCancel={popupConfirmState.onCancel}
            />
          ) : null}
          <ToastContainer />
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/manage-users" element={<ManageUser />} />
              <Route path="/add" element={<Add />} />
              <Route path="/list" element={<List />} />
              <Route path="/food/:id" element={<EditFood />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:order_id/:user_id" element={<OrderDetail />} />
              <Route path="/vouchers" element={<Vouchers />} />
              <Route path="/edit-food/:item_id" element={<EditFood />} />
              <Route path="/add-voucher" element={<AddVoucher />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
        </div>
      ) : (
        <NoPermissionPage />
      )}
    </>
  );
}
