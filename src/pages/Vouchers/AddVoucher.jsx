import "./AddVoucher.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRef } from "react";

function AddVouchers() {
  const apiUrl = "http://localhost:4000/api";

  const startDateRef = useRef(null);

  const [vouchers, setVouchers] = useState({
    code: "",
    codeDes: "",
    discountType: "fixed",
    discountVal: "",
    minToDiscount: "",
    maxDiscount: "",
    usage: "",
    startDate: "",
    endDate: "",
  });

  const handleChangeInput = (e) => {
    const regex = /^\d*$/;
    let { name, value } = e.target;
    if (name === "usage" && !regex.test(value)) return;
    if (name === "discountVal" && !regex.test(value)) return;
    if (name === "maxDiscount" && !regex.test(value)) return;
    if (name === "minToDiscount" && !regex.test(value)) return;

    if(name === "code") {
      if(value.length > 15) return;

      value = value.toUpperCase();
    }

    if(name === "endDate") {
      const currentStartDate = startDateRef.current.value;
      
      if(!currentStartDate) {
        toast.warn("Vui lòng chọn ngày bắt đầu trước");
        return;
      }
    }

    setVouchers({
      ...vouchers,
      [name]: value,
    });
  };

  const setMinDate = (date) => {

    if(date) {
      const [yyyy, mm, dd] = date.split("-");
      return `${yyyy}-${mm}-${dd}`;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  };

  const handleAddVoucher = async (e) => {
    e.preventDefault();
    console.log(vouchers);
    try {
      const response = await axios.post(
        `${apiUrl}/voucher/add-voucher`,
        vouchers
      );

      const result = response.data;
      
      if (result.success && result.data) {
        toast.success(result.message);
        setVouchers({
          code: "",
          codeDes: "",
          discountType: "fixed",
          discountVal: "",
          minToDiscount: "",
          maxDiscount: "",
          usage: "",
          startDate: "",
          endDate: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="vouchers">
      <form className="flex-col" onSubmit={handleAddVoucher}>
        <div className="voucher-code flex-col">
          <label htmlFor="code">Mã ưu đãi</label>
          <input
            onChange={handleChangeInput}
            value={vouchers.code}
            name="code"
            type="text"
            id="code"
            placeholder="Nhập mã ưu đãi"
          />
        </div>

        <div className="voucher-desc flex-col">
          <label htmlFor="">Mô tả về mã ưu đãi</label>
          <textarea
            onChange={handleChangeInput}
            value={vouchers.codeDes}
            name="codeDes"
            id=""
            rows=""
            placeholder="Nhập mô tả"
          ></textarea>
        </div>

        <div className="voucher-discount-type flex-col">
          <label htmlFor="discount-type">Loại ưu đãi</label>
          <select
            name="discountType"
            id="discount-type"
            onChange={handleChangeInput}
            value={vouchers.discountType}
          >
            <option value="percentage">Phần trăm (%)</option>
            <option value="fixed">Tiền (VNĐ)</option>
          </select>
        </div>

        {/* số tiền tối thiểu để áp dụng mã ưu đãi */}
        <div className="voucher-minimum flex-col">
          <label htmlFor="minimum">Tối thiểu để áp dụng mã</label>
          <input
            onChange={handleChangeInput}
            name="minToDiscount"
            type="text"
            id="minimum"
            placeholder="Nhập số tiền tối thiểu (VNĐ)"
            value={vouchers.minToDiscount}
          />
        </div>

        {/* số tiền giảm giá nếu ở dạng tiền */}
        {vouchers.discountType === "fixed" ? (
          <div className="voucher-discount flex-col">
            <label htmlFor="discount">Số tiền giảm giá</label>
            <input
              onChange={handleChangeInput}
              name="discountVal"
              type="text"
              id="discount"
              placeholder="Nhập giá trị giảm giá (VNĐ)"
              value={vouchers.discountVal}
            />
          </div>
        ) : (
          <div className="voucher-discount flex-col">
            <label htmlFor="discount">Phần trăm giảm giá</label>
            <input
              onChange={handleChangeInput}
              name="discountVal"
              type="text"
              id="discount"
              placeholder="Nhập giá trị giảm giá (%)"
              value={vouchers.discountVal}
            />
          </div>
        )}

        {/* số tiền giảm giá tối đa nếu ở dạng % */}
        {vouchers.discountType === "percentage" && (
          <div className="max-discount-amount flex-col">
            <label htmlFor="max-discount">Số tiền giảm tối đa</label>
            <input
              onChange={handleChangeInput}
              name="maxDiscount"
              type="text"
              id="max-discount"
              placeholder="Nhập số tiền giảm tối đa (VNĐ)"
              value={vouchers.maxDiscount}
            />
          </div>
        )}

        <div className="voucher-usage flex-col">
          <label htmlFor="usage">Số lần sử dụng</label>
          <input
            onChange={handleChangeInput}
            name="usage"
            type="text"
            id="usage"
            placeholder="Nhập số lần sử dụng"
            value={vouchers.usage}
          />
        </div>

        {/* ngày có hiệu lực sử dụng */}
        <div className="voucher-start-date flex-col">
          <label htmlFor="start-date">Ngày bắt đầu</label>
          <input
            ref={startDateRef}
            onChange={handleChangeInput}
            name="startDate"
            type="date"
            id="start-date"
            value={vouchers.startDate}
            min={setMinDate()}
          />
        </div>

        {/* ngày hết hạn sử dụng */}
        <div className="voucher-end-date flex-col">
          <label htmlFor="end-date">Ngày kết thúc</label>
          <input
            onChange={handleChangeInput}
            name="endDate"
            type="date"
            id="end-date"
            value={vouchers.endDate}
            min={setMinDate(vouchers.startDate)}
          />
        </div>

        <button type="submit" className="add-voucher-btn">
          Thêm voucher
        </button>
      </form>
    </div>
  );
}

export default AddVouchers;
