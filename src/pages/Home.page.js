import { useContext } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import ExpenseCard from '../components/ExpenseCard.component';
import { useQuery } from 'react-query';

const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);

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
  const loadExpenses = () => request(GRAPHQL_ENDPOINT,
    getAllExpensesQuery,
    queryVariables,
    headers
  );

  // Now, instead of using useEffect, we are using useQuery.
  // Also, we don't need to manage state separately. The data
  // is already managed by the useQuery hook.
  const { isLoading, error, data, refetch } = useQuery("allExpenses", loadExpenses);

  // Helper function to be performed whenever an expense gets deleted.
  // Here, instead of calling the loadExpenses function, we are calling
  // the refetch function. This will trigger the loadExpenses function
  // on our behalf, and will update the state automatically.
  const afterDelete = () => {
    refetch();
  };

  if (isLoading) return "Loading";

  if (error) return error.message;

  return <PageContainer>
    <h1>All Expenses</h1>
    {
      data.expenses
        .map(expense => ({ ...expense, key: expense._id, afterDelete }))
        .map(expense => <ExpenseCard {...expense} />)
    }
  </PageContainer>
}

export default Home;