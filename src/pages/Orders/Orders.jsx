import "./Orders.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import TrackingItem from "../../components/TrackingItem/TrackingItem";
import { toast } from "react-toastify";
import classNames from "classnames";

function TrackingOrders() {
  const navigate = useNavigate();
  const { token, apiUrl, setShowLoginPopup } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [ordersFilter, setOrdersFilter] = useState("all");

  if (!token) {
    navigate("/");
    setShowLoginPopup(true);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(`${apiUrl}/order/get-all-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const result = response.data;

        if (result.success && result.data) {
          if (result.data.length > previousOrders.length) {
            setOrders(result.data);
            toast.success("Bạn có đơn hàng mới.");
            setPreviousOrders(result.data);
          }
        }
      }
    };

    if (token) {
      const interval = setInterval(() => {
        console.log("fetching orders");

        fetchOrders();
      }, 3000);

      fetchOrders();

      return () => clearInterval(interval);
    }
  }, [previousOrders, token, apiUrl]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const filterOrders = async () => {
      const response = await axios.get(`${apiUrl}/order/get-all-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const result = response.data;

        if (result.success && result.data) {
          const orders = result.data;
          if (ordersFilter === "all") {
            setOrders(orders);
          } else if (ordersFilter === "pending") {
            setOrders(orders.filter((order) => order.status === "pending"));
          } else if (ordersFilter === "confirmed") {
            setOrders(orders.filter((order) => order.status === "confirmed"));
          } else if (ordersFilter === "preparing") {
            setOrders(orders.filter((order) => order.status === "preparing"));
          } else if (ordersFilter === "delivering") {
            setOrders(orders.filter((order) => order.status === "delivering"));
          } else if (ordersFilter === "completed") {
            setOrders(orders.filter((order) => order.status === "completed"));
          } else if (ordersFilter === "canceled") {
            setOrders(orders.filter((order) => order.status === "canceled"));
          }
        }
      }
    };

    filterOrders();
  }, [ordersFilter]);

  const handleFilterOrder = (filter) => {
    setOrdersFilter(filter);
  };

  console.log(orders);

  return (
    <div className="tracking-container">
      <div className="tracking-content">
        <h2>Theo dõi đơn hàng</h2>
        <div className="tracking-tabs">
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "all",
            })}
            onClick={() => handleFilterOrder("all")}
          >
            Tất cả
          </div>
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "pending",
            })}
            onClick={() => handleFilterOrder("pending")}
          >
            Đang chờ xác nhận
          </div>
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "confirmed",
            })}
            onClick={() => handleFilterOrder("confirmed")}
          >
            Đã xác nhận
          </div>
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "preparing",
            })}
            onClick={() => handleFilterOrder("preparing")}
          >
            Đang Làm món
          </div>
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "delivering",
            })}
            onClick={() => handleFilterOrder("delivering")}
          >
            Đang giao hàng
          </div>
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "completed",
            })}
            onClick={() => handleFilterOrder("completed")}
          >
            Giao hàng thành công
          </div>
          <div
            className={classNames("tracking-tab", {
              active: ordersFilter === "canceled",
            })}
            onClick={() => handleFilterOrder("canceled")}
          >
            Đã hủy
          </div>
        </div>
        <div className="tracking-list">
          {orders.length > 0 ? (
            orders?.map((item) => {
              return (
                <TrackingItem
                  key={item.order_id}
                  tracking_item={item}
                  onCanceled={async (order_id) => {
                    setOrdersFilter("canceled");
                  }}
                  className="tracking-list-item"
                />
              );
            })
          ) : (
            <p className="no-orders">Bạn chưa có đơn hàng nào</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackingOrders;
