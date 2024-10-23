import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Vouchers.css";
import VoucherItem from "../../components/VoucherItem";
import { toast } from "react-toastify";

function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const apiUrl = "http://localhost:4000/api";

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/voucher/vouchers`);
        const result = response.data;

        if (result.success && result.data) {
          const data = result.data;
          setVouchers(data);
        } else {
          toast.error(result.message, {
            pauseOnHover: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <div className="voucher add flex-col">
      <h2>Ưu đãi cho khách hàng</h2>
      <Link to="/add-voucher" className="btn-add-voucher">
        Thêm ưu đãi
      </Link>

      {vouchers.length > 0 ? (
        <VoucherItem vouchers={vouchers} onDeleteVoucher={setVouchers} />
      ) : (
        <p>Chưa có ưu đãi nào</p>
      )}
    </div>
  );
}

export default Vouchers;
