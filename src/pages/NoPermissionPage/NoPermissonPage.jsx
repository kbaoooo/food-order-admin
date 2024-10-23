import "./NoPermissionPage.css";

function NoPermissionPage() {
  return (
    <div className="no-permission-wrapper">
      <div className="no-permission-content">
        <h3>Xin lỗi, bạn không có quyền hạn truy cập trang này.</h3>
        <a href="http://localhost:5173">Trở về mua hàng</a>
      </div>
    </div>
  );
}

export default NoPermissionPage;
