import { useEffect, useState } from "react";
import { Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, TimeScale, Tooltip } from "chart.js";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import { Line as LineChart } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

interface ChartContainerProps {
  label: string;
  color?: string;
  chartData: { x: number; y: number }[];
}

export const chartDisplayFormats = {
  second: "HH:mm:ss",
  minute: "HH:mm",
  hour: "HH:mm",
  day: "DD MMM",
  week: "DD MMM",
  month: "MMM YYYY",
  quarter: "[Q]Q YYYY",
  year: "YYYY",
};

const ChartContainer: React.FC<ChartContainerProps> = ({ label, color, chartData }) => {
  const durationTs = 1 * 60 * 60 * 1000;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 500);

    return () => clearInterval(intervalId);
  }, [now]);

  const chartRenderData = {
    datasets: [
      {
        label: label,
        data: chartData,
        borderColor: color || "orange",
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
  return (
    <>
      <h2 className="text-2xl text-center font-bold">Chart</h2>
      <div className="relative w-full max-w-screen-md h-[300px] mx-auto">
        <LineChart
          data={chartRenderData}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                type: "time",
                min: now - durationTs,
                max: now,
                time: {
                  displayFormats: chartDisplayFormats,
                },
              },
            },
            animation: {
              duration: 250,
            },
          }}
        />
      </div>
    </>
  );
};

export default ChartContainer;
