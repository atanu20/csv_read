import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { apilink } from '../data/fdata';
import { CircularProgress } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const atokon = Cookies.get('_fileupload_access_user_tokon_');
  const [myData, setMyData] = useState([]);
  const his = useHistory();
  const login = localStorage.getItem('_fileupload_access_user_login');
  const [loading, setLoading] = useState(false);
  const notify = (msg) =>
    toast.dark(msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  useEffect(() => {
    if (!login) {
      his.push('/login');
    }
    getalldata();
  }, []);
  const getalldata = async () => {
    setLoading(true);
    const res = await axios.get(`${apilink}/user/getAllUpload`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (res.data.success) {
      setMyData(res.data.msg);
    } else {
      notify(res.data.msg);
    }
    setLoading(false);
  };
  return (
    <>
      <ToastContainer />
      <div className="dash">
        <div className="container">
          <div className="row">
            <div className="col-12 mx-auto">
              <div className="card p-3">
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>FileName</th>
                        <th>Records</th>
                        <th>CreatedAt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myData?.map((val) => {
                        return (
                          <>
                            <tr>
                              <td className="tdlink">
                                <NavLink to={`/dashboard/${val._id}`}>
                                  {val.filename}
                                </NavLink>
                              </td>
                              <td>{val.records}</td>
                              <td>
                                {new Date(val.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
