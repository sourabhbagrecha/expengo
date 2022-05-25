import Chart from "react-google-charts";

const ModeAnalytics = ({ data }) => {
  const chartData = [["Mode", "Amount"]];
  data.forEach(({ mode, amount }) => {
    chartData.push([mode, amount]);
  });
  return <>
    <h3>Mode Analytics</h3>
    <Chart
      chartType="PieChart"
      data={chartData}
      width={"100%"}
      height={"400px"}
    />
  </>
}

export default ModeAnalytics;