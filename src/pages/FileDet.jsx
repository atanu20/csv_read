import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { apilink } from '../data/fdata';
import { CircularProgress } from '@material-ui/core';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { read, utils } from 'xlsx';
import ReactPaginate from 'react-paginate';

const FileDet = () => {
  const atokon = Cookies.get('_fileupload_access_user_tokon_');
  const [myData, setMyData] = useState([]);
  const [myColData, setMyColData] = useState([]);
  const [myRowData, setMyRowData] = useState([]);
  const his = useHistory();
  const login = localStorage.getItem('_fileupload_access_user_login');
  const [loading, setLoading] = useState(false);
  const { fileid } = useParams();

  const [pageNo, setPageNo] = useState(0);
  const perpage = 50;
  const pagevisit = pageNo * perpage;

  const dataall = myRowData?.slice(pagevisit, pagevisit + perpage);
  const boxno = Math.ceil(myRowData?.length / perpage);

  const likedChange = ({ selected }) => {
    setPageNo(selected);
  };

  //   console.log(fileid);

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
    const res = await axios.get(`${apilink}/user/getdatabyid/${fileid}`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (res.data.success) {
      setMyData(res.data.msgs);

      const f = await (await fetch(res.data.msgs.filelink)).arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const data = utils.sheet_to_json(ws); // generate objects
      //   console.log(data); // update state
      setMyColData(Object.keys(data[0]));
      setMyRowData(data);
    } else {
      notify(res.data.msg);
    }
    setLoading(false);
  };
  //   console.log(myRowData);
  return (
    <>
      <ToastContainer />
      <div className="dash">
        <div className="container">
          <div className="row">
            <div className="col-12 mx-auto">
              {loading ? (
                <>
                  <div className="card p-3">
                    <div className="text-center">
                      <h4>Data Loading...</h4>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="card p-3">
                    <p>
                      Selected Dataset <b>{myData?.filename}</b>
                    </p>
                    <div class="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            {myColData?.map((val) => {
                              return (
                                <>
                                  <th>{val}</th>
                                </>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {dataall?.map((v) => {
                            return (
                              <>
                                <tr>
                                  {myColData?.map((item, ind) => {
                                    return <td>{v[item]}</td>;
                                  })}
                                </tr>
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="row">
            <ReactPaginate
              previousLabel={'Prev'}
              nextLabel={'Next'}
              pageCount={boxno}
              onPageChange={likedChange}
              containerClassName={'pagination'}
              // previousLinkClassName={"prevbutton"}
              // nextLinkClassName={"nextbutton"}
              // disabledClassName={"pagedisable"}
              activeClassName={'activebutton'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileDet;
