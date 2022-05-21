import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExpenseForm from "../components/ExpenseForm.component";
import { useNavigate } from "react-router-dom";

const CreateExpense = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Some prefilled form state
  const [form, setForm] = useState({
    amount: "640",
    category: "Education",
    mode: "Credit Card",
    title: "Online Course",
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

  const onSubmit = async (event) => {
    event.preventDefault();
    const { amount, category, mode, title } = form;
    if (amount.length === 0 || category.length === 0 || mode.length === 0 || title.length === 0) {
      return;
    }
    try {
      await request(GRAPHQL_ENDPOINT, createExpenseQuery, queryVariables, headers);

      // Navigate to the Home page after creating an expense
      navigate(`/`);
    } catch (error) {
      alert(error)
    }
  };

  return <PageContainer>
    <ExpenseForm onSubmit={onSubmit} form={form} setForm={setForm} title="Create Expense" />
  </PageContainer>
}

export default CreateExpense;