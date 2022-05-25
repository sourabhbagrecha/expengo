import Chart from "react-google-charts";

const CategoryAnalytics = ({ data }) => {
  const chartData = [["Category", "Amount"]];
  data.forEach(({ category, amount }) => {
    chartData.push([category, amount]);
  });
  return <>
    <h3>Category Analytics</h3>
    <Chart
      chartType="PieChart"
      data={chartData}
      width={"100%"}
      height={"400px"}
    />
  </>
}

export default CategoryAnalytics;