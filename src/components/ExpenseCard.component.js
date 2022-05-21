import { Delete, Edit } from "@mui/icons-material";
import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import request, { gql } from "graphql-request";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";

const ExpenseCard = ({ _id, title, amount, category, mode, createdAt, afterDelete }) => {
  const { user } = useContext(UserContext);

  // GraphQL query to delete an expense
  const deleteExpenseQuery = gql`
  mutation DeleteExpense($query: ExpenseQueryInput!) {
    deleteOneExpense(query: $query) {
      _id
    }
  }
  `;

  // Passing the expense-id in the query to delete a specific expense
  const queryVariables = { query: { _id } };

  const headers = { Authorization: `Bearer ${user._accessToken}` };

  // deleteThisExpense function is responsible for deleting the
  // expense based on the expense-id provided and then calling the
  // afterDelete function to do the cleanup. 
  const deleteThisExpense = async () => {

    // Confirming the user's action
    const resp = window.confirm("Are you sure you want to delete this expense?");
    if (!resp) return;

    try {
      await request(GRAPHQL_ENDPOINT, deleteExpenseQuery, queryVariables, headers);
      afterDelete();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Card style={{ marginBottom: "1rem", paddingBottom: 0 }} elevation={1}>
      <CardContent>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant='body2' color="text.secondary" gutterBottom>
              {category}
            </Typography>
            <Typography variant="h6" component={Link} to={`/expense/${_id}`}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">
              ₹{amount}/-
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {mode}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Link to={`/expense/${_id}/edit`}>
              <IconButton color="primary">
                <Edit />
              </IconButton>
            </Link>
            <IconButton color="error" onClick={deleteThisExpense}>
              <Delete />
            </IconButton>
            <Typography variant="body1" color="text.secondary">
              {(new Date(createdAt)).toDateString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ExpenseCard;