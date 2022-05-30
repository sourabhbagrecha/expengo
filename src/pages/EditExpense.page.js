import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExpenseForm from "../components/ExpenseForm.component";
import { useParams, useNavigate } from "react-router-dom";
import useAuthedMutation from "../hooks/useAuthedMutation";
import useAuthedQuery from "../hooks/useAuthedQuery";

const EditExpense = () => {
  const { user } = useContext(UserContext);
  const { id: expenseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    category: "",
    mode: "",
    title: "",
    createdAt: new Date()
  });

  // ****** Expense fetching logic till line no. 63 ******
  // Fetch expense to pre fill the form with the 
  // current state of the expense.
  const getExpenseQuery = gql`
    query getExpense($query: ExpenseQueryInput!) {
      expense(query: $query) {
        _id
        title
        amount
        mode
        category
        createdAt
      }
    }
    `;

  const queryVariables = { query: { _id: expenseId } }

  const headers = { Authorization: `Bearer ${user._accessToken}` };

  const fetchExpense = () => request(
    GRAPHQL_ENDPOINT,
    getExpenseQuery,
    queryVariables,
    headers
  );

  // Wraping our fetchExpense function with useQuery and 
  // updating the state of the form once it's successful.
  const { isLoading, error } = useAuthedQuery("fetchExpense", fetchExpense, {
    onSuccess: (data) => {
      const { title, mode, amount, category, createdAt } = data.expense;
      setForm({
        title,
        mode,
        amount: amount.toString(),
        category,
        createdAt
      });
    }
  });

  // ***** Expense Update logic till line no. 101 *****
  const { amount, category, mode, title, createdAt } = form;

  const editExpenseMutation = gql`
    mutation EditExpense($query: ExpenseQueryInput!, $set: ExpenseUpdateInput!) {
      updateOneExpense(query: $query, set: $set) {
        _id
      }
    }
    `;

  const queryAndUpdateVariables = {
    query: {
      _id: expenseId
    },
    set: {
      title: title,
      amount: parseInt(amount),
      mode: mode,
      category: category,
      createdAt: createdAt
    },
  };

  // Replacing our default onSumbit function with useMutation
  // wrapped function, so that we can utilize the helper
  // states and functions provided by react-query.
  const mutation = useAuthedMutation(() => request(
    GRAPHQL_ENDPOINT,
    editExpenseMutation,
    queryAndUpdateVariables,
    headers
  ), {
    onSuccess: () => {
      navigate(`/`)
    }
  });

  if (isLoading) return "Loading Expense";

  if (error) return error;

  return <PageContainer>
    <ExpenseForm
      form={form}
      setForm={setForm}
      onSubmit={mutation.mutate}
      disabled={mutation.isLoading}
      editing
    />
  </PageContainer>
}

export default EditExpense;