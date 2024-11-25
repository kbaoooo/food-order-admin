import "./Home.css";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { formatCurrency, formatDate } from "../../helpers";
import axios from "axios";

Chart.register(CategoryScale);

function Home() {
  const [revenueOfMonth, setRevenueOfMonth] = useState(0);
  const [revenueByDay, setRevenueByDay] = useState(0);
  const [revenuePerMonth, setRevenuePerMonth] = useState([]);

  const { apiUrl, token } = useContext(StoreContext);

  useEffect(() => {
    const getRevenueOfMonth = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/order/get-revenue-by-month`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            setRevenueOfMonth(result.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRevenueOfMonth();
  }, []);

  useEffect(() => {
    const getRevenuePerMonth = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/order/get-revenue-per-month`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            setRevenuePerMonth(result.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRevenuePerMonth();
  }, []);

  useEffect(() => {
    const getRevenueByDay = async () => {
      try {
        const response = await axios.get(`${apiUrl}/order/get-revenue-by-day`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            setRevenueByDay(result.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRevenueByDay();
  }, []);

  console.log(revenueByDay);

  const dataPie = {
    labels: ["Doanh thu thực tế", "Doanh thu còn thiếu"],
    // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
    datasets: [
      {
        label: "Popularity of colours",
        data: [revenueOfMonth, 200000000 - revenueOfMonth],
        // you can set indiviual colors for each bar
        backgroundColor: ["rgba(253,135,135,1)", "rgba(43,63,229,1)"],
        borderWidth: 1,
      },
    ],
  };

  const dataDoughnut = {
    labels: ["Doanh thu thực tế", "Doanh thu còn thiếu"],
    // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
    datasets: [
      {
        label: "Popularity of colours",
        data: [
          revenueByDay.total_revenue,
          7000000 - revenueByDay.total_revenue,
        ],
        backgroundColor: ["rgba(75,192,192,1)", "rgba(255,159,64,1)"],
        borderWidth: 1,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const dataBar = {
    labels: revenuePerMonth.map((month) => month.month),
    datasets: [
      {
        label: `Doanh thu năm ${new Date().getFullYear()}`,
        data: revenuePerMonth.map((month) => month.total_revenue),
        backgroundColor: "rgba(253,135,135,1)",
        borderColor: "red",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="home-container">
      <div className="home-wrapper">
        <h2>Thống kê của nhà hàng Tomato</h2>
        <div className="home-content">
          <div className="charts">
            <div className="chart-group">
              <div className="home-chart box">
                <h3>Doanh thu ngày {formatDate(revenueByDay.day)}</h3>
                <p>Mục tiêu trong ngày: {formatCurrency(7000000)}</p>
                <div className="doughnut-chart">
                  <Doughnut data={dataDoughnut} />
                </div>
              </div>

              <div className="home-chart box">
                <h3>Doanh thu tháng {new Date().getMonth() + 1}</h3>
                <p>Mục tiêu tháng: {formatCurrency(200000000)}</p>
                <div className="pie-chart">
                  <Pie data={dataPie} />
                </div>
              </div>
            </div>

            <div className="home-chart box">
              <h3>Doanh thu trong năm {new Date().getFullYear()}</h3>
              <div className="bar-chart">
                <Bar data={dataBar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
