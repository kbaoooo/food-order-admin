import "./TrackingItem.css";
import { assets } from "../../assets/assets";
import { formatCurrency, formatDateTime } from "../../helpers";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

function TrackingItem({ tracking_item, className, onCanceled }) {
  const {
    token,
    apiUrl,
    setPopupConfirmState: setShowPopupConfirm,
    setShowLoginPopup,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  if (!token) {
    navigate("/");
    setShowLoginPopup(true);
  }

  const handleCancelOrder = () => {
    setShowPopupConfirm({
      show: true,
      message: "Bạn có chắc muốn hủy đơn hàng này không?",
      question: "Hủy đơn hàng",
      onConfirm: async () => {
        setShowPopupConfirm({
          show: false,
          message: "",
          question: "",
          onConfirm: null,
          onCancel: null,
        });
        if (tracking_item?.payment_method === "money") {
          try {
            const response = await axios.post(
              `${apiUrl}/order/update-order-status`,
              {
                order_id: tracking_item?.order_id,
                status: "canceled",
                user: {
                  username: tracking_item?.username,
                  email: tracking_item?.email,
                },
                order_customer_id: tracking_item?.user_id,
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
                toast.success("Đã hủy đơn hàng");
                onCanceled(tracking_item?.order_id);
              }
            }
          } catch (error) {
            setShowPopupConfirm({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
          }
        }

        if (tracking_item?.payment_method === "zalopay") {
          try {
            const response = await axios.post(
              `${apiUrl}/payment/refund-payment`,
              {
                payment_method: tracking_item?.payment_method,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response && response.data) {
              const result = response.data;
              console.log(result);
            }
          } catch (error) {
            setShowPopupConfirm({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
          }
        }
      },
      onCancel: () => {
        setShowPopupConfirm({
          show: false,
          message: "",
          question: "",
          onConfirm: null,
          onCancel: null,
        });
      },
    });
  };

  return (
    <div className={classNames("tracking-item-container", className)}>
      <div className="tracking-item-content">
        {tracking_item?.status === "canceled" ? (
          <span className="canceled-span">Đã hủy</span>
        ) : (
          tracking_item?.status === "pending" && (
            <button className="cancel-order-btn" onClick={handleCancelOrder}>
              Hủy đơn
            </button>
          )
        )}
        <div className="tracking-item-image">
          <img src={assets.tomatoImage} alt="" />
        </div>

        <div className="tracking-item-info">
          <div className="tracking-item-info__title">
            <h3>Đơn hàng: {tracking_item?.order_id}</h3>
            <p>Ngày đặt hàng: {formatDateTime(tracking_item?.created_at)}</p>
          </div>
          <div className="tracking-item-info-content">
            <p className="tracking-item-info">
              Khách hàng: <span>{tracking_item?.username}</span>
            </p>
            <p className="tracking-item-info">
              Số điện thoại: <span>{tracking_item?.phone_number}</span>
            </p>
            <p className="tracking-item-info">
              Trạng thái:{" "}
              <span
                className={classNames({
                  cancelled: tracking_item?.status === "canceled",
                })}
              >
                {tracking_item?.status === "pending"
                  ? "Đang chờ xác nhận"
                  : tracking_item?.status === "confirmed"
                  ? "Đã được xác nhận"
                  : tracking_item?.status === "preparing"
                  ? "Đang chuẩn bị món ăn"
                  : tracking_item?.status === "delivering"
                  ? "Đang giao hàng"
                  : tracking_item?.status === "completed"
                  ? "Đã giao hàng"
                  : "Đã hủy"}
              </span>
            </p>
            <p className="tracking-item-info">
              Thanh toán:{" "}
              <span>
                {tracking_item?.payment_method === "money"
                  ? "Thanh toán khi nhận hàng"
                  : "Zalopay"}
              </span>
            </p>
            <p className="tracking-item-info-voucher">
              Mã giảm giá:{" "}
              {tracking_item?.voucher_id
                ? tracking_item?.code
                : "Không áp dụng"}
            </p>
            <p className="tracking-item-info-total-price">
              Tổng tiền: {formatCurrency(tracking_item?.total_amount)}
            </p>
          </div>
        </div>
      </div>
      <button
        className="tracking-view-detail-btn"
        onClick={() =>
          navigate(
            `/order/${tracking_item?.order_id}/${tracking_item?.user_id}`
          )
        }
      >
        Xem chi tiết đơn hàng
      </button>
    </div>
  );
}

export default TrackingItem;
