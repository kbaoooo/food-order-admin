import "./OrderDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../../context/StoreContext";
import axios from "axios";
import { formatCurrency, formatDateTime } from "../../../helpers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [statusChanged, setStatusChanged] = useState({
    order_status: false,
    payment_status: false,
  });
  const [orderStatusValue, setOrderStatusValue] = useState("");
  const [paymentStatusValue, setPaymentStatusValue] = useState("");
  const { order_id, user_id } = useParams();
  const navigate = useNavigate();
  const { token, apiUrl, setPopupConfirmState } = useContext(StoreContext);

  if (!token) {
    window.location.href = "http://localhost:5173";
  }

  const orderStatus = [
    {
      title: "Đang xác nhận",
      value: "pending",
    },
    {
      title: "Xác nhận",
      value: "confirmed",
    },
    {
      title: "Đang làm món ăn",
      value: "preparing",
    },
    {
      title: "Đang giao hàng",
      value: "delivering",
    },
    {
      title: "Đã giao hàng",
      value: "completed",
    },
  ];

  const paymentStatus = [
    {
      title: "Đang chờ thanh toán",
      value: "pending",
    },
    {
      title: "Đã thanh toán",
      value: "completed",
    },
    {
      title: "Thanh toán thất bại",
      value: "failed",
    },
  ];

  useEffect(() => {
    const fecthUserInfo = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/auth/get-user-by-id/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = response.data;

        if (result && result.success && result.data) {
          setUserInfo(result.data);
        }
      } catch (error) {
        navigate("/page-note-found");
      }
    };

    fecthUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/order/get-order-info-by-order/${order_id}/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            const orderInfo = result.data;

            if (orderInfo && orderInfo.order_id && orderInfo.products) {
              setOrderStatusValue(orderInfo.order_status);
              setPaymentStatusValue(orderInfo.payment_status);
              setOrder(orderInfo);
            } else return navigate("/page-note-found");
          }
        }
      } catch (error) {
        navigate("/page-note-found");
      }
    };

    if (token) {
      fetchOrderData();
    }
  }, []);

  const handleChangeOrderStatus = async (e) => {
    setOrderStatusValue(e.target.value);
    if (e.target.value !== order?.order_status) {
      setStatusChanged({ ...statusChanged, order_status: true });
    } else {
      setStatusChanged({ ...statusChanged, order_status: false });
    }
  };

  const handleChangePaymentStatus = async (e) => {
    setPaymentStatusValue(e.target.value);
    if (e.target.value !== order?.payment_status) {
      setStatusChanged({ ...statusChanged, payment_status: true });
    } else {
      setStatusChanged({ ...statusChanged, payment_status: false });
    }
  };

  const handleSaveChangeStatus = async (type) => {
    switch (type) {
      case "order":
        setPopupConfirmState({
          show: true,
          message: "Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?",
          question: "Cập nhật trạng thái",
          onConfirm: async () => {
            try {
              const response = await axios.post(
                `${apiUrl}/order/update-order-status`,
                {
                  order_id: order_id,
                  status: orderStatusValue,
                  order_customer_id: userInfo?.user_id,
                  user: userInfo,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response && response.data) {
                const result = response.data;

                if (result.success) {
                  setPopupConfirmState({
                    show: false,
                    message: "",
                    question: "",
                    onConfirm: null,
                    onCancel: null,
                  });

                  setStatusChanged({ ...statusChanged, order_status: false });
                  toast.success("Cập nhật trạng thái đơn hàng thành công");
                  try {
                    const response = await axios.get(
                      `${apiUrl}/order/get-order-info-by-order/${order_id}/${user_id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    if (response && response.data) {
                      const result = response.data;

                      if (result.success && result.data) {
                        const orderInfo = result.data;

                        if (
                          orderInfo &&
                          orderInfo.order_id &&
                          orderInfo.products
                        ) {
                          setOrderStatusValue(orderInfo.order_status);
                          setPaymentStatusValue(orderInfo.payment_status);
                          setOrder(orderInfo);
                        } else return navigate("/page-note-found");
                      }
                    }
                  } catch (error) {
                    navigate("/page-note-found");
                  }
                } else {
                  setPopupConfirmState({
                    show: false,
                    message: "",
                    question: "",
                    onConfirm: null,
                    onCancel: null,
                  });
                  toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
                }
              }
            } catch {
              setPopupConfirmState({
                show: false,
                message: "",
                question: "",
                onConfirm: null,
                onCancel: null,
              });
              toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
            }
          },
          onCancel: () => {
            setPopupConfirmState({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
          },
        });
        break;
      case "payment":
        setPopupConfirmState({
          show: true,
          message: "Bạn có chắc chắn muốn cập nhật trạng thái thanh toán?",
          question: "Cập nhật trạng thái",

          onConfirm: async () => {
            try {
              const response = await axios.post(
                `${apiUrl}/payment/update-payment-status`,
                {
                  status: paymentStatusValue,
                  username: userInfo?.username,
                  transaction_id: order?.transaction_id,
                  user: userInfo,
                }
              );

              if (response && response.data) {
                const result = response.data;

                if (result.success) {
                  setPopupConfirmState({
                    show: false,
                    message: "",
                    question: "",
                    onConfirm: null,
                    onCancel: null,
                  });
                  setStatusChanged({ ...statusChanged, payment_status: false });
                  toast.success("Cập nhật trạng thái thanh toán thành công");
                  try {
                    const response = await axios.get(
                      `${apiUrl}/order/get-order-info-by-order/${order_id}/${user_id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    if (response && response.data) {
                      const result = response.data;

                      if (result.success && result.data) {
                        const orderInfo = result.data;

                        if (
                          orderInfo &&
                          orderInfo.order_id &&
                          orderInfo.products
                        ) {
                          setOrderStatusValue(orderInfo.order_status);
                          setPaymentStatusValue(orderInfo.payment_status);
                          setOrder(orderInfo);
                        } else return navigate("/page-note-found");
                      }
                    }
                  } catch (error) {
                    navigate("/page-note-found");
                  }
                } else {
                  setPopupConfirmState({
                    show: false,
                    message: "",
                    question: "",
                    onConfirm: null,
                    onCancel: null,
                  });
                  toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
                }
              }
            } catch {
              setPopupConfirmState({
                show: false,
                message: "",
                question: "",
                onConfirm: null,
                onCancel: null,
              });
              toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
            }
          },
          onCancel: () => {
            setPopupConfirmState({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
          },
        });
        break;
      default:
        break;
    }
  };
  console.log(order);

  return (
    <div className="order-detail-container">
      <div className="order-detail-wrapper">
        <h2>Thông tin chi tiết về đơn hàng</h2>

        <div className="order-detail-content">
          <div className="order-products box">
            <div className="order-status">
              <div className="order-status-title">
                <h3>Trạng thái đơn hàng</h3>
              </div>

              <div className="order-status-content">
                <div className="order-status-item">
                  <label>Trạng thái đơn hàng:</label>
                  <select
                    value={orderStatusValue}
                    onChange={handleChangeOrderStatus}
                  >
                    {orderStatus.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {statusChanged.order_status && (
                    <button
                      className="order-status-update-btn"
                      onClick={() => handleSaveChangeStatus("order")}
                    >
                      Luu thay đổi
                    </button>
                  )}
                </div>
                <div className="order-status-item">
                  <label>Trạng thái thanh toán:</label>
                  <select
                    value={paymentStatusValue}
                    onChange={handleChangePaymentStatus}
                  >
                    {order?.payment_method === "money" ? (
                      paymentStatus.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))
                    ) : (
                      <option value="completed">Đã thanh toán</option>
                    )}
                  </select>
                  {statusChanged.payment_status && (
                    <button
                      className="order-status-update-btn"
                      onClick={() => handleSaveChangeStatus("payment")}
                    >
                      Lưu thay đổi
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="order-list-table">
              <div className="order-list-table-format title">
                <b>Món ăn</b>
                <b>Phân loại</b>
                <b>Số lượng</b>
                <b>Tổng cộng</b>
              </div>
              {order &&
                order?.products.map((item) => (
                  <div key={item?.item_id} className="order-list-table-format">
                    <div className="flex order-list-table-format-product">
                      <img
                        src={`http://localhost:4000/images/${item.image_url}`}
                        alt={item.name}
                      />
                      <p>{item.name}</p>
                    </div>
                    <p>{item.category_name}</p>
                    <p>{item.quantity}</p>
                    <p>{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
            </div>

            <div className="order-info">
              <div className="order-detail-info">
                <div className="order-detail-info-title">
                  <h3>Thông tin người nhận</h3>
                </div>
                <div className="order-detail-info-content">
                  <div className="order-detail-text">
                    <p>
                      Họ tên: <span>{userInfo?.username}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Số điện thoại: <span>{userInfo?.phone_number}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Địa chỉ:{" "}
                      <span>
                        {userInfo?.address
                          ? userInfo?.address
                          : "Chưa cập nhật địa chỉ"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-detail-info">
                <div className="order-detail-info-title">
                  <h3>Thông tin đơn hàng</h3>
                </div>
                <div className="order-detail-info-content">
                  <div className="order-detail-text">
                    <p>
                      Mã đơn hàng: <span>{order?.order_id}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Ngày tạo: <span>{formatDateTime(order?.created_at)}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Phương thức thanh toán:{" "}
                      <span>
                        {order?.payment_method === "money"
                          ? "Thanh toán khi nhận hàng"
                          : "Zalopay"}
                      </span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Thanh toán:{" "}
                      <span>
                        {order?.payment_status === "pending"
                          ? "Đang chờ thanh toán"
                          : order?.payment_status === "completed"
                          ? "Đã thanh toán"
                          : "Thanh toán thất bại"}
                      </span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Mã voucher:{" "}
                      <span>
                        {order?.voucher_id
                          ? `${order?.voucher_code} - Giảm ${formatCurrency(
                              order?.total_discount
                            )}`
                          : "Không áp dụng"}
                      </span>
                    </p>
                  </div>

                  <div className="order-detail-text">
                    <p>
                      Ghi chú:{" "}
                      <span>{order?.note ? order?.note : "Không có"}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Số lượng:{" "}
                      <span>
                        {order?.products.reduce((acc, product) => {
                          return acc + product.quantity;
                        }, 0)}
                      </span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Tổng tiền:{" "}
                      <span>{formatCurrency(order?.total_amount)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="color-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
