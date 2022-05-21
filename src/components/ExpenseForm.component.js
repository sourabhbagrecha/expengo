import { Button, TextField } from "@mui/material";
import CustomDatePicker from "./CustomDatePicker.component";
import PageContainer from "./PageContainer.component";

const ExpenseForm = ({ onSubmit, form, setForm, editing }) => {
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return <PageContainer>
    <form onSubmit={onSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>{editing ? "Edit expense" : "Create Expense"}</h1>
      <TextField
        label="Title"
        type="text"
        variant="outlined"
        name="title"
        value={form.title}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <TextField
        label="Amount"
        type="number"
        variant="outlined"
        name="amount"
        value={form.amount}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <TextField
        label="Mode"
        type="text"
        variant="outlined"
        name="mode"
        value={form.mode}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <TextField
        label="Category"
        type="text"
        variant="outlined"
        name="category"
        value={form.category}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <CustomDatePicker
        label="Date"
        value={form.createdAt}
        onChange={(v) => { setForm({ ...form, createdAt: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      />
      <Button variant="contained" color="primary" onClick={onSubmit} type="submit">
        {editing ? "Update" : "Create"} Expense
      </Button>
    </form>
  </PageContainer>;
}

export default ExpenseForm;