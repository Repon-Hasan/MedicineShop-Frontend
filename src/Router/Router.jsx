import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Component/Home/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import UpdateProfile from "../Pages/UpdateProfile";
import Dashboard from "../Dashboard/Dashboard";
import CategoryDetails from "../Component/CategoryCards/CategoryDetails";
import AllMedicinesPage from "../Pages/AllMedicinesPage";
import CartPage from "../Pages/CartPage";
import Checkout from "../Pages/Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import InvoicePage from "../Pages/InvoicePage";
import Privaterout from "../Component/PrivateRoute/Privaterout";
import DiscountDetails from "../Component/DiscountedProductsSlider/DiscountDetails";
import Contact from "../Component/Contact/Contact";
import About from "../Component/About/About";
import ErrorComponent from "../Pages/ErrorComponent";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>, 
    children: [
      {
        path: "/", // route: "/"
        element: <Home></Home>,
      },
      {
        path: "/login", // route: "/"
        element: <SignUp></SignUp>,
      },
      {
        path: "/signin", // route: "/"
        element: <Login></Login>,
      },
      {
        path: "/update-profile", // route: "/"
        element: <UpdateProfile></UpdateProfile>,
      },
      {
        path: "/dashboard", // route: "/"
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/shop", // route: "/"
        element: <Privaterout><AllMedicinesPage></AllMedicinesPage></Privaterout>,
      },
      {
        path: "/cart", // route: "/"
        element: <Privaterout><CartPage></CartPage></Privaterout>,
      },
      {
  path: "/invoice",
  element: <InvoicePage></InvoicePage>
},
      {
        path: "/checkout", // route: "/"
        element:<Elements stripe={stripePromise}>
                <Checkout></Checkout>
    </Elements>
      },
{
  path: "/category/:id",
  loader: async ({ params }) => {
    const res = await fetch(`https://backend-nu-livid-37.vercel.app/category/${params.id}`);
    if (!res.ok) {
      throw new Response("Failed to fetch category data", { status: res.status });
    }
    return res.json();
  },
  element: <CategoryDetails />,
  errorElement: <div className="p-6 text-red-500 text-center">Category not found or failed to load.</div>,
},
{
  path: "/discountCategory/:id",
  loader: async ({ params }) => {
    const res = await fetch(`https://backend-nu-livid-37.vercel.app/category/${params.id}`);
    if (!res.ok) {
      throw new Response("Failed to fetch category data", { status: res.status });
    }
    return res.json();
  },
  element: <DiscountDetails></DiscountDetails>,
  errorElement: <div className="p-6 text-red-500 text-center">Category not found or failed to load.</div>,
},
      {
        path: "contact", // route: "/about"
        element: <Contact></Contact>,
      },
      {
        path: "about", // route: "/about"
        element: <About></About>,
      },
      {
        path: "*", // route: "/about"
        element: <ErrorComponent></ErrorComponent>,
      
      },
    //   {
    //     path: "contact", // route: "/contact"
    //     element: <Contact />,
    //   },
    ],
  },
]);