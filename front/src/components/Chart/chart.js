import React from 'react';
import { Bar, Line, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2';

const ChartComponent = (props) => {
  const chartTypes = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    scatter: Scatter,
  };

  const chartData = {
    labels: props.data.labels || [],
    datasets: [
      {
        label: props.chartTitle || '',
        data: props.data.datasets || [],
        backgroundColor: props.backgroundColor || 'rgba(75, 192, 192, 0.2)',
        borderColor: props.borderColor || 'rgba(75, 192, 192, 1)',
        borderWidth: props.borderWidth || 1,
      },
    ],
  };

  const ChartType = chartTypes[props.chartType] || Bar;

  return (
    <div className="chart">
      <ChartType
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default ChartComponent;
