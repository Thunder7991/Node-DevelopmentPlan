import { Navigate, createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../views/ErrorPage';
import Layout from '../views/Layout';
import Aaa from '../views/Aaa';
import Bbb from '../views/Bbb';
import Login from '../views/Login';
import {Register} from '../views/Register';
import {UpdatePassword} from '../views/UpdatePassword';
import { Index } from '../views';
import { UpdateInfo } from '../views/UpdateInfo';
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
  },
  {
    path:'/index',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo></UpdateInfo>
      },
      {
        path: 'bbb',
        element: <div>bbb</div>
      }
    ]

  }
];

export const router = createBrowserRouter(routes)