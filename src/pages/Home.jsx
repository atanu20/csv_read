import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apilink } from '../data/fdata';
import { read, utils, writeFileXLSX } from 'xlsx';
import { CircularProgress } from '@material-ui/core';

const Home = () => {
  const atokon = Cookies.get('_fileupload_access_user_tokon_');
  const [uploadfile, setUploadFile] = useState([]);
  const [uploadfilename, setUploadFileName] = useState('');
  const login = localStorage.getItem('_fileupload_access_user_login');
  const [myData, setMyData] = useState([]);
  const his = useHistory();

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!login) {
      his.push('/login');
    }
    getuser();
  }, []);
  const getuser = async () => {
    const res = await axios.get(`${apilink}/user/userinfor`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (res.data.success) {
      setMyData(res.data.user);
    } else {
      his.push('/login');
    }
  };

  const onSub = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (uploadfile.size > 10000000) {
      setStatus(true);
      setMsg('File should be less then 10 MB');
    } else {
      if (
        uploadfile.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        uploadfile.type === 'text/csv' ||
        uploadfile.type === 'application/vnd.ms-excel'
      ) {
        let formData = new FormData();
        formData.append('file', uploadfile);
        formData.append('filename', uploadfilename);

        //work done
        const res = await axios.post(`${apilink}/user/uploadfile`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: atokon,
          },
        });
        // console.log(res.data);
        if (res.data.success) {
          const data = {
            filename: uploadfilename,
            filelink: res.data.url.secure_url,
            records: res.data.url.data_len,
            userId: myData._id,
          };

          const ress = await axios.post(`${apilink}/user/uploaddata`, data, {
            headers: {
              Authorization: atokon,
            },
          });
          // console.log(ress.data);
          if (ress.data.success) {
            his.push('/dashboard');
          } else {
            setStatus(true);
            setMsg(res.data.msg);
          }
        } else {
          setStatus(true);
          setMsg(res.data.msg);
        }

        //working not json
      } else if (uploadfile.type === 'application/json') {
        let reader = new FileReader();
        // Setup the callback event to run when the file is read
        reader.onload = logFile;
        // Read the file
        reader.readAsText(uploadfile);
      } else {
        setStatus(true);
        setMsg('Upload Only JSON , XLSX , CSV , XLS');
      }
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   (async () => {
  //     const f = await (
  //       await fetch(
  //         'https://res.cloudinary.com/du9emrtpi/raw/upload/v1661577386/techno_gbhpo1.xlsx'
  //       )
  //     ).arrayBuffer();
  //     const wb = read(f); // parse the array buffer
  //     const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
  //     const data = utils.sheet_to_json(ws); // generate objects
  //     console.log(data); // update state
  //   })();
  // }, []);
  function logFile(event) {
    let str = event.target.result;
    let json = JSON.parse(str);
    // console.log('string', str);
    // console.log('json', json);
    const ws = utils.json_to_sheet(json);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, `${uploadfilename.split(' ').join('_')}.xlsx`);
    setStatus(true);
    setMsg(
      `Your Xlsx file is ready , Now Upload ${uploadfilename
        .split(' ')
        .join('_')}.xlsx`
    );
  }
  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8 col-12 mx-auto">
              <h3>Hi {myData?.name?.split(' ')[0]}</h3>
              <br />
              <div className="card p-3">
                {status ? (
                  <>
                    <div class="alert alert-warning alert-dismissible">
                      <button
                        type="button"
                        class="close"
                        data-dismiss="alert"
                        onClick={() => setStatus(false)}
                      >
                        &times;
                      </button>
                      {msg}
                    </div>
                  </>
                ) : null}
                <form action="" onSubmit={onSub}>
                  <div class="form-group">
                    <label for="usr">Upload File:</label>
                    <input
                      type="file"
                      class="form-control"
                      accept=".xlsx, .xls, .csv , .json"
                      required
                      onChange={(e) => setUploadFile(e.target.files[0])}
                    />
                  </div>
                  <div class="form-group">
                    <label for="usr">Dataset Name:</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="File Name"
                      required
                      onChange={(e) => setUploadFileName(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className={
                        loading ? 'dis btn btn-primary' : 'btn btn-primary'
                      }
                      disabled={loading}
                    >
                      Upload File
                    </button>
                  </div>
                  {loading && (
                    <div className="text-center p-2">
                      <CircularProgress size={45} />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
