import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import History from "./Pages/History";
import Root from "./Root";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="Sweeft-Project/" element={<Root />}>
        <Route index={true} element={<Home />} />
        <Route path={"history"} element={<History />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
