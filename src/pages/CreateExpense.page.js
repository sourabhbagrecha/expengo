import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExpenseForm from "../components/ExpenseForm.component";
import { useNavigate } from "react-router-dom";
import useAuthedMutation from "../hooks/useAuthedMutation";

const CreateExpense = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Some prefilled form state
  const [form, setForm] = useState({
    title: "New Online Course",
    amount: "640",
    category: "Education",
    mode: "Credit Card",
    createdAt: new Date()
  });

  // GraphQL query to create an expense
  const createExpenseQuery = gql`
  mutation AddExpense($data: ExpenseInsertInput!) {
    insertOneExpense(data: $data) {
      _id
    }
  }
  `;

  // All the data that needs to be sent to the GraphQL endpoint
  // to create an expense will be passed through queryVariables.
  const queryVariables = {
    data: {
      title: form.title,
      amount: parseInt(form.amount),
      mode: form.mode,
      category: form.category,
      author: user.id,
      createdAt: form.createdAt
    }
  };

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  const headers = { Authorization: `Bearer ${user._accessToken}` };

  // Normally, we would've created an onSubmit function to make the GraphQL
  // request. But with react-query, we can simply replace that with a
  // useMutation wrapper, which in-return will provide us some good helper 
  // functions and state to standardize the behavior of our component.
  const mutation = useAuthedMutation(async () => request(
    GRAPHQL_ENDPOINT,
    createExpenseQuery,
    queryVariables,
    headers
  ), {
    onSuccess: () => {
      navigate(`/`)
    }
  });

  // useMutation provides a mutate method which can be used
  // to trigger the request. Also, we will disable the submit
  // button till the time mutation is in the loading state.
  return <PageContainer>
    <ExpenseForm
      title="Create Expense"
      form={form}
      setForm={setForm}
      onSubmit={mutation.mutate}
      disabled={mutation.isLoading}
    />
  </PageContainer>
}

export default CreateExpense;