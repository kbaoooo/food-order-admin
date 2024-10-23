import "./ManageUser.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

function ManageUser() {
  const emailRef = useRef(null);
  const { authenticationAdmin, apiUrl, token } = useContext(StoreContext);
  const [admins, setAdmins] = useState([]);
  const [emailValue, setEmailValue] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      const isAdmin = await authenticationAdmin();

      if (!isAdmin) {
        window.location.href = "http://localhost:5173/no-permission";
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/auth/get-admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            setAdmins(result.data);
          }
        }
      } catch (error) {
        toast.error("Cannot fetch admins");
      }
    };

    fetchAdmins();
  }, []);

  const handleAddRole = async () => {
    const isAdmin = await authenticationAdmin();

    if (!isAdmin) {
      window.location.href = "http://localhost:5173/no-permission";
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/auth/update-user-role`,
        {
          email: emailValue,
          type: "upgrade",
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
          emailRef.current.focus();
          setEmailValue("");
          toast.success("Thêm quản trị viên thành công");

          try {
            const response = await axios.get(`${apiUrl}/auth/get-admins`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response && response.data) {
              const result = response.data;

              if (result.success && result.data) {
                setAdmins(result.data);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      const errorData = error.response.data;
      if (
        !errorData.success &&
        errorData.message === "User is already an admin"
      ) {
        toast.error("Người dùng đã là quản trị viên");
      } else if (
        !errorData.success &&
        errorData.message === "Cannot change role of super admin"
      ) {
        toast.error("Không thể thay đổi quyền của super admin");
      } else if (!errorData.success && errorData.message === "User not found") {
        toast.error("Người dùng không tồn tại");
      } else if (
        !errorData.success &&
        errorData.message === "Failed to update user role"
      ) {
        toast.error("Cập nhật quyền người dùng thất bại");
      }
    }
  };

  const handleDeleteRole = async (email) => {
    const isAdmin = await authenticationAdmin();

    if (!isAdmin) {
      window.location.href = "http://localhost:5173/no-permission";
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/auth/update-user-role`,
        {
          email,
          type: "downgrade",
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
          toast.success("Xóa quản trị viên thành công");

          try {
            const response = await axios.get(`${apiUrl}/auth/get-admins`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response && response.data) {
              const result = response.data;

              if (result.success && result.data) {
                setAdmins(result.data);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      const errorData = error.response.data;
      if (!errorData.success && errorData.message === "User is not an admin") {
        toast.error("Người dùng không phải là quản trị viên");
      } else if (
        !errorData.success &&
        errorData.message === "Cannot change role of super admin"
      ) {
        toast.error("Không thể thay đổi quyền của super admin");
      } else if (!errorData.success && errorData.message === "User not found") {
        toast.error("Người dùng không tồn tại");
      } else if (
        !errorData.success &&
        errorData.message === "Failed to update user role"
      ) {
        toast.error("Cập nhật quyền người dùng thất bại");
      }
    }
  };

  return (
    <div className="manage-user-container">
      <div className="manage-user-wrapper">
        <div className="manage-user-content">
          <h2>Quản lý quyền người dùng</h2>

          <div className="manage-user-form">
            <h3>Thêm người dùng</h3>
            <div className="manage-user-input">
              <label htmlFor="email">Email quản trị viên</label>
              <input
                ref={emailRef}
                type="text"
                id="email"
                placeholder="Email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </div>
            <button onClick={handleAddRole}>Thêm quản trị viên</button>
          </div>

          <div className="manage-user-list">
            <h3>Danh sách quản trị viên</h3>
            <div className="manage-user-list-wrapper">
              {admins.map((admin) => (
                <div key={admin.user_id} className="manage-user-list-item">
                  <p>{admin.email}</p>
                  {admin.isAdmin == 2 ? (
                    <FontAwesomeIcon icon={faCrown} className="crown-icon" />
                  ) : (
                    <button onClick={() => handleDeleteRole(admin.email)}>
                      Xóa quản trị viên
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUser;
