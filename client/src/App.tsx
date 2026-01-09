import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            {/* Define your routes here */}
            <Route path="*" element={<div>Welcome to the App!</div>} />
            <Route />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
