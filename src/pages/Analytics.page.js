import { useContext, useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import request, { gql } from "graphql-request";
import { formatISO, subMonths, endOfToday, startOfDay, endOfDay } from "date-fns";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import ModeAnalytics from "../components/ModeAnalytics.component";
import CategoryAnalytics from "../components/CategoryAnalytics.component";

const Analytics = () => {
  // By default we would like to fetch the analytics for the last 1 month.
  // So we will take the fromDate as today minus 1 month and
  // the toDate as today.
  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);

  const { user } = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);


  const loadAnalytics = async () => {

    // GraphQL query to fetch mode analytics as well as the category analytics.
    const getAnalyticsQuery = gql`
      query getAnalytics($query: Filter!) {
        modeAnalytics(input: $query) {
          modes {
            amount
            mode
          }
        }
        categoryAnalytics(input: $query) {
          categories {
            amount
            category
          }
        }
      }
    `;

    // Query variables that will be used to perform the analytics from a particular 
    // date to a particular date.
    const queryVariables = { query: { from: formatISO(startOfDay(fromDate)), to: formatISO(endOfDay(toDate)) } };

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      const resp = await request(GRAPHQL_ENDPOINT, getAnalyticsQuery, queryVariables, headers);
      const { modeAnalytics: { modes }, categoryAnalytics: { categories } } = resp;
      setAnalyticsData({ modes, categories });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    loadAnalytics(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <h1>Analytics Home</h1>
      <CustomDatePicker label="From" value={fromDate} onChange={setFromDate} style={{ marginRight: "2rem" }} />
      <CustomDatePicker label="To" value={toDate} onChange={setToDate} style={{ marginRight: "2rem" }} />
      <Button onClick={loadAnalytics} variant="contained" style={{ margin: "0 auto" }} size="large">Refresh</Button>
      {analyticsData && <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ModeAnalytics data={analyticsData.modes} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryAnalytics data={analyticsData.categories} />
        </Grid>
      </Grid>}
    </PageContainer>
  );
}

export default Analytics;