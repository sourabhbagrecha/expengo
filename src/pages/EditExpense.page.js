import { useContext, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExpenseForm from "../components/ExpenseForm.component";
import { useParams, useNavigate } from "react-router-dom";

const EditExpense = () => {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    mode: "",
    title: "",
    createdAt: new Date()
  });

  const { id: expenseId } = useParams();
  const navigate = useNavigate();

  const loadExpense = async () => {
    // GraphQL query to fetch the details of an expense
    // using expenseId
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

    const resp = await request(GRAPHQL_ENDPOINT, getExpenseQuery, queryVariables, headers);

    // Destructuring the values of the expense fetched
    // and auto-filling it into the form.
    const { title, mode, amount, category, createdAt } = resp.expense;
    setForm({
      title,
      mode,
      amount: amount.toString(),
      category,
      createdAt
    });
  };

  useEffect(() => {
    loadExpense(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { amount, category, mode, title, createdAt } = form;

    // Checking if values are empty before submitting.
    if (amount.length === 0 || category.length === 0 || mode.length === 0 || title.length === 0) {
      return;
    }

    // GraphQL mutation to edit the details of an expense
    const editExpenseMutation = gql`
    mutation EditExpense($query: ExpenseQueryInput!, $set: ExpenseUpdateInput!) {
      updateOneExpense(query: $query, set: $set) {
        _id
      }
    }
    `;

    // Here, we will be including all the keys and their respective values needed
    // to fetch the exact expense and update it accordingly with
    // newly inputted values.
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

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      await request(GRAPHQL_ENDPOINT, editExpenseMutation, queryAndUpdateVariables, headers);

      // Navigating to homepage once the updates are sent and confirmed.
      navigate(`/`);
    } catch (error) {
      alert(error)
    }
  };

  return <PageContainer>
    <ExpenseForm onSubmit={onSubmit} form={form} setForm={setForm} editing />
  </PageContainer>
}

export default EditExpense;