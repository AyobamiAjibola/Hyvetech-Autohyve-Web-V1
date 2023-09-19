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

const labels = [
  "12am - 3am",
  "3am - 6am",
  "6am- 9am",
  "9am - 12pm",
  "12pm - 3pm",
  "3pm - 6pm",
  "6pm - 9pm",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Total Sales",
      data: [7, 8, 5, 3, 8, 4, 6],
      backgroundColor: "#FAA21B",
    },
    {
      label: "Total Receipts",
      data: [4, 9, 8, 2, 8, 7, 8],
      backgroundColor: "#FFD89B",
    },
  ],
};

export default function CustomBarChart() {
  return <Bar options={options} data={data} width={300} />;
}
