import { useContext, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import ExpenseCard from '../components/ExpenseCard.component';

const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);

  const [expenses, setExpenses] = useState([]);

  // GraphQL query to fetch all the expenses from the collection. 
  const getAllExpensesQuery = gql`
  query getAllExpenses {
    expenses(sortBy: CREATEDAT_DESC) {
      _id
      title
      amount
      mode
      category
      createdAt
    }
  }
  `;

  // Since we don't want to filter the results as of now,
  // we will just use the empty query object
  const queryVariables = {};

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  const headers = { Authorization: `Bearer ${user._accessToken}` }

  // loadExpenses function is responsible for making the GraphQL
  // request to Realm and update the expenses array from the response. 
  const loadExpenses = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllExpensesQuery,
      queryVariables,
      headers
    );
    setExpenses(_ => resp.expenses.map(expense => ({ ...expense, key: expense._id, afterDelete })));
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Helper function to be performed after an expense has been deleted.
  const afterDelete = () => {
    loadExpenses();
  }

  return <PageContainer>
    <h1>All Expenses</h1>
    {
      expenses.map(expense => <ExpenseCard {...expense} />)
    }
  </PageContainer>
}

export default Home;