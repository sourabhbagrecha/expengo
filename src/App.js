import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import { UserProvider } from "./contexts/user.context";
import Analytics from "./pages/Analytics.page";
import CreateExpense from "./pages/CreateExpense.page";
import EditExpense from "./pages/EditExpense.page";
import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import PrivateRoute from "./pages/PrivateRoute.page";
import Signup from "./pages/Signup.page";

const queryClient = new QueryClient();

function App() {
  return (
    // We are wrapping our whole app with UserProvider so that 
    // our user is accessible through out the app from any page
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <NavBar />
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            {/* We are protecting our Home Page from unauthenticated */}
            {/* users by wrapping it with PrivateRoute here. */}
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/new" element={<CreateExpense />} />
              <Route exact path="/expense/:id/edit" element={<EditExpense />} />
              <Route exact path="/analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
