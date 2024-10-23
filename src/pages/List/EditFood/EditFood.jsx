import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { formatCurrency, formatDate, customRound } from "../../../helpers";
import { StoreContext } from "../../../context/StoreContext";
import "./EditFood.css";

import axios from "axios";
import { toast } from "react-toastify";

function EditFood() {
  const [food, setFood] = useState({});
  const { id } = useParams();
  const [foodImage, setFoodImage] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodPrice, setFoodPrice] = useState(0);
  const [foodCategory, setFoodCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [foodAvailable, setFoodAvailable] = useState(0);

  const { token, apiUrl, handleShowPopupMessage } = useContext(StoreContext);

  if (!token) {
    window.location.href = "http://localhost:5173/";
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${apiUrl}/menu/get-categories`);
        const result = response.data;
        const { success, data } = result;

        if (success && data) {
          setCategoryList(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFood = async () => {
      try {
        const response = await axios.get(`${apiUrl}/menu/get-food/${id}`);
        const result = response.data;
        const { success, data } = result;

        if (success && data) {
          setFood(data);
          setFoodImage(data?.image_url);
          setFoodName(data?.item_name);
          setFoodDescription(data?.description);
          setFoodPrice(data?.price);
          setFoodAvailable(data?.available);
          setFoodCategory(data?.category_id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, []);

  const handleChangeImage = (e) => {
    setFoodImage(e.target.files[0]);
  };

  const handleChangeName = (e) => {
    setFoodName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setFoodDescription(e.target.value);
  };

  const handleChangePrice = (e) => {
    setFoodPrice(e.target.value);
  };

  const handleChangeCategory = (e) => {
    setFoodCategory(e.target.value);
  };

  const handleChangeAvailable = (e) => {
    setFoodAvailable(e.target.value);
  };

  const handleSubmitSaveChange = async () => {
    const formData = new FormData();

    formData.append("item_id", id);
    formData.append("image", foodImage);
    formData.append("item_name", foodName);
    formData.append("description", foodDescription);
    formData.append("price", foodPrice);
    formData.append("category_id", foodCategory);
    formData.append("available", foodAvailable);

    try {
      const response = await axios.post(`${apiUrl}/menu/edit-food`, formData);

      if (response && response.data) {
        const result = response.data;

        if (result.success && result.data) {
          console.log(result.data);
          
          setFood(result.data);
          toast.success("Cập nhật thành công", {
            pauseOnHover: false,
          });
        } else {
          toast.error("Cập nhật thất bại", {
            pauseOnHover: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra hãy thử lại sau", {
        pauseOnHover: false,
      });
    }
  };

  console.log(food);

  return (
    <div className="editfood-container">
      <div className="editfood-wrapper">
        <div className="editfood-content">
          <h2>Sửa món ăn</h2>
          <div className="editfood-form">
            <div className="editfood-input">
              <label htmlFor="image">
                <img
                  src={
                    foodImage instanceof Blob
                      ? URL.createObjectURL(foodImage)
                      : `http://localhost:4000/images/${food?.image_url}`
                  }
                  alt=""
                />
              </label>
              <input
                onChange={(e) => handleChangeImage(e)}
                type="file"
                id="image"
                hidden
                required
              />
            </div>
            <div className="editfood-input">
              <label>Tên món</label>
              <input type="text" onChange={handleChangeName} value={foodName} />
            </div>
            <div className="editfood-input">
              <label>Mô tả</label>
              <input
                type="text"
                onChange={handleChangeDescription}
                value={foodDescription}
              />
            </div>
            <div className="editfood-input">
              <label htmlFor="">Giá</label>
              <input
                type="text"
                onChange={handleChangePrice}
                value={foodPrice}
              />
            </div>
            <div className="editfood-input">
              <label htmlFor="">Phân loại</label>
              <select
                name=""
                id=""
                onChange={handleChangeCategory}
                value={foodCategory}
              >
                {categoryList.length > 0 &&
                  categoryList.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="editfood-input">
              <label htmlFor="">Tình trạng</label>
              <select
                name=""
                id=""
                onChange={handleChangeAvailable}
                value={foodAvailable}
              >
                <option value="1">Còn hàng</option>
                <option value="0">Hết hàng</option>
              </select>
            </div>
            <button onClick={handleSubmitSaveChange}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditFood;
