/* eslint-disable react/prop-types */
import { formatCurrency, formatDate, formatPercent } from "../helpers";
import "./VoucherItem.css";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

function VoucherItem({ vouchers, onDeleteVoucher }) {
  const { setPopupConfirmState, apiUrl } = useContext(StoreContext);

  const typeMap = {
    percentage: "Phần trăm",
    fixed: "Tiền mặt",
  };

  const percentageVouchers = vouchers?.filter(
    (voucher) => voucher.discount_type === "percentage"
  );

  const fixedVouchers = vouchers?.filter(
    (voucher) => voucher.discount_type === "fixed"
  );

  const handleDeleteVoucher = (voucher_id) => {
    setPopupConfirmState({
      show: true,
      message: "Xác nhận xoá ưu đãi",
      question: "Bạn có chắc chắn muốn xoá ưu đãi này?",
      onConfirm: async () => {
        try {
          const response = await axios.delete(`${apiUrl}/voucher/delete-voucher/${voucher_id}`);

          const result = response.data;
          
          if(result.success) {
            toast.success("Xóa ưu đãi thành công", {
              pauseOnHover: false,
            });
            onDeleteVoucher((prevVouchers) => prevVouchers.filter((voucher) => voucher.voucher_id !== voucher_id));
            setPopupConfirmState({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
          } else {
            toast.error(result.message, {
              pauseOnHover: false,
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau", {
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
    });
  };

  return (
    <div className="voucher-item-wrapper">
      <div>
        <h2 className="voucher-title">Ưu đãi cố định</h2>
        {fixedVouchers?.map((voucher) => (
          <div key={voucher.voucher_id} className="voucher-item">
            <button
              className="btn-delete-voucher"
              onClick={() => handleDeleteVoucher(voucher.voucher_id)}
            >
              <span>Xoá</span>
            </button>
            <p>
              <span>Mã ưu đãi: </span>
              <span>{voucher.code}</span>
            </p>
            <p>
              <span>Mô tả: </span>
              <span>{voucher.description}</span>
            </p>
            <p>
              <span>Loại ưu đãi: </span>
              <span>{typeMap[voucher.discount_type]}</span>
            </p>
            <p>
              <span>Đơn tối thiểu: </span>
              <span>{formatCurrency(voucher.min_order_amount)}</span>
            </p>
            <p>
              <span>Giảm: </span>
              <span>{formatCurrency(voucher.discount_value)}</span>
            </p>
            <p>
              <span>Số lượt sử dụng: </span>
              <span>{voucher.usage_count}</span>
            </p>
            <p>
              <span>Giới hạn sử dụng: </span>
              <span>{voucher.usage_limit}</span>
            </p>
            <p>
              <span>Ngày bắt đầu: </span>
              <span>{formatDate(voucher.valid_from)}</span>
            </p>
            <p>
              <span>Ngày hết hạn: </span>
              <span>{formatDate(voucher.valid_to)}</span>
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="voucher-title">Ưu đãi theo phần trăm</h2>
        {percentageVouchers?.map((voucher) => (
          <div key={voucher.voucher_id} className="voucher-item">
            <button
              className="btn-delete-voucher"
              onClick={() => handleDeleteVoucher(voucher.voucher_id)}
            >
              <span>Xoá</span>
            </button>
            <p>
              <span>Mã ưu đãi: </span>
              <span>{voucher.code}</span>
            </p>
            <p>
              <span>Mô tả: </span>
              <span>{voucher.description}</span>
            </p>
            <p>
              <span>Loại ưu đãi: </span>
              <span>{typeMap[voucher.discount_type]}</span>
            </p>
            <p>
              <span>Đơn tối thiểu: </span>
              <span>{formatCurrency(voucher.min_order_amount)}</span>
            </p>
            <p>
              <span>Giảm: </span>
              <span>{formatPercent(voucher.discount_value)}</span>
            </p>
            <p>
              <span>Giảm tối đa: </span>
              <span>{formatCurrency(voucher.max_discount_amount)}</span>
            </p>
            <p>
              <span>Số lượt sử dụng: </span>
              <span>{voucher.usage_count}</span>
            </p>
            <p>
              <span>Giới hạn sử dụng: </span>
              <span>{voucher.usage_limit}</span>
            </p>
            <p>
              <span>Ngày bắt đầu: </span>
              <span>{formatDate(voucher.valid_from)}</span>
            </p>
            <p>
              <span>Ngày hết hạn: </span>
              <span>{formatDate(voucher.valid_to)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoucherItem;
