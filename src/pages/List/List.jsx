import { useEffect, useContext } from "react";
import "./List.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatCurrency } from "../../helpers";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function List() {
  const { apiUrl, token, setPopupConfirmState } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/menu/get-menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = response.data;

      if (result.success) {
        setList(result.data);
      } else {
        toast.error(result.message, {
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        pauseOnHover: false,
      });
    }
  };

  const handleRemoveFood = async (item_id) => {
    const popupInfo = {
      show: true,
      message: "Bạn có chắc chắn muốn xóa món ăn này?",
      question: "Xác nhận xóa",
      onConfirm: async () => {
        try {
          const response = await axios.post(
            `${apiUrl}/menu/remove-food`,
            {
              item_id,
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
              toast.success(result.message, {
                pauseOnHover: false,
              });
              fetchList();
            } else {
              toast.error(result.message, {
                pauseOnHover: false,
              });
            }
          } else {
            toast.error("Something went wrong", {
              pauseOnHover: false,
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong", {
            pauseOnHover: false,
          });
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
    };

    setPopupConfirmState(popupInfo);
  };

  const handleEditfood = (item_id) => {
    navigate(`/food/${item_id}`);
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>Danh sách món ăn</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Ảnh</b>
          <b>Tên món</b>
          <b>Miêu tả</b>
          <b>Phân loại</b>
          <b>Giá</b>
          <b>Hành động</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img
              src={`http://localhost:4000/images/${item.image_url}`}
              alt={item.name}
            />
            <p>{item.item_name}</p>
            <p>{item.description}</p>
            <p>{item.category_name}</p>
            <p>{formatCurrency(item.price)}</p>
            <div className="food-actions">
              <button className="btn btn-edit" onClick={() => handleEditfood(item?.item_id)}>Sửa</button>
              <button
                onClick={() => handleRemoveFood(item?.item_id)}
                className="btn btn-delete"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
