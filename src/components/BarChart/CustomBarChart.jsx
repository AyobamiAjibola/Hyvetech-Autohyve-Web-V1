import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },

  indexAxis: "x",
  barPercentage: 0.4,
  categoryPercentage: 0.7,
};

export default function CustomBarChart(props) {
  const data = {
    labels: props.categories,
    datasets: props.series
  };
  return <Bar options={options} data={data} width={300} />;
}
