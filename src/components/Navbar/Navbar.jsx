import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const { token, apiUrl } = useContext(StoreContext);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            setAdmin(result.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchAdmin();
    }
  }, []);

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="" />
      </Link>

      <div className="admin-info">
        {token && (
          <div className="admin-ava">
            <img className="profile" src={assets.user} alt="" />
            <p>{admin?.username}</p>
          </div>
        )}
      </div>
    </div>
  );
}
