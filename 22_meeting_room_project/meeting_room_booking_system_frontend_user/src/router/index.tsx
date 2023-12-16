import { Navigate, createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../views/ErrorPage';
import Layout from '../views/Layout';
import Aaa from '../views/Aaa';
import Bbb from '../views/Bbb';
import Login from '../views/Login';
import {Register} from '../views/Register';
import UpdatePassword from '../views/UpdatePassword';
const routes = [
  {
    path: '/',
    // element: <Layout />,
    element: <Navigate to='/login' /> ,
 
    errorElement: <ErrorPage />,
    
    children: [
      // {
      //   path: 'aaa',
      //   element: <Aaa />,
      // },
      // {
      //   path: 'bbb',
      //   element: <Bbb />,
      // },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  }
];

export const router = createBrowserRouter(routes)