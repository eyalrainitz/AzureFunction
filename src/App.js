import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [blob, setblob] = useState("");
  const [input, setinput] = useState("");
  const [ResdData, setResData] = useState([]);
  const functionappNode = "selafunctionpocnode"
  const functionappPython = "selafunctionpython"
  
  const SendName = async (name) => {
    if (name !== null || name !== "" || name !== " ") {
      await axios
        .post(`https://${functionappNode}.azurewebsites.net/api/BlobPost`, {
          name,
        })
        .then((res) => {
          setResData(res.data);
          console.log(res.data);
        });
    }
  };
  const [cosmosGet, setcosmosGet] = useState([]);
  const cosmosGetnode = async () => {
    await axios
      .get(`https://${functionappNode}.azurewebsites.net/api/CosmosGet`)
      .then((res) => setcosmosGet([...res.data]));
  };
  const CosmosPostNode = async (name) => {
    await axios
      .post(`https://${functionappNode}.azurewebsites.net/api/CosmosPost`, {
        name,
      })
      .then((res) => setcosmosGet([...res.data]));
  };

  const [UserData, setUserData] = useState([]);
  const GetName = async (name) => {
    await axios
      .get(
        `https://${functionappNode}.azurewebsites.net/api/BlobGet/?name=${name}`
      )
      .then((res) => setUserData(res.data))
      .then((jsondata) => {
        console.log(jsondata);
      })
      .catch((error) => console.log(error));
  };
  const cosmosGetData = cosmosGet.map((user, index) => (
    <div key={index}>{user}</div>
  ));
  const [cGet, setcGet] = useState("");
  /////////////////////////////////// python
  const [cosmosGetPython, setcosmosGetPython] = useState('');
  // Get number of items in cosmosdb
  const CosmosGetPython = async (number) => {
    await axios
      .post(`https://${functionappPython}.azurewebsites.net/api/CosmosGet`,{number})
      .then((res) => setcosmosGetPython(JSON.parse(JSON.stringify(res.data))));
  };
  const [cosmosPostPython, setcosmosPostPython] = useState([]);
  // Post User inside DB
  const CosmosPostPython = (name) => {
    axios
      .post(`https://${functionappPython}.azurewebsites.net/api/CosmosPost`, 
        {name},
      )
      .then((res) => setcosmosPostPython(JSON.parse(JSON.stringify(res.data))));
  };
  const [HttpBlobGPython, setHttpBlobython] = useState([]);
  // http get blob data need name
  const HttpBlobGetPython = (name) => {
    axios
      .get(
        `https://${functionappPython}.azurewebsites.net/api/HttpBlob/?name=${name}`
      )
      .then((res) => setHttpBlobython(res.data));
  };
  const [HttpBlobPPython, setHttpBlobPostPython] = useState([]);
  // http post data
  const HttpBlobPostPython = (name) => {
    axios
      .post(`https://${functionappPython}.azurewebsites.net/api/HttpBlobPost`, {
        name,
      })
      .then((res) => setHttpBlobPostPython(res.data));
  };

  ////////////////////////////////////////

  // cosmos python delete all items
  const HttpCosmosDeleteAll = () => {
    axios
      .get(
        `https://${functionappPython}.azurewebsites.net/api/DeleteItemsInCosmosDB`
      )
      .then((res) => console.log(res));
  };

  // cosmos python delete by name
  const HttpCosmosDeleteUser = (name) => {
    axios
      .post(
        `https://${functionappPython}.azurewebsites.net/api/CosmosDelete`,
        name
      )
      .then((res) => console.log(res));
  };
  ////////////////////////////////////////////////////

  // delete blob
  const HttpDeleteBlob = (name) =>{
    axios.post(`https://${functionappPython}.azurewebsites.net/api/blobstorageDelete`)
  }
  ////////////////////////////////////////////////////

  useEffect(() => {
    cosmosGetnode();
  }, []);


  
  const handleChangeGet = (e) =>{
    setcGet(e.target.value)
  }
  const handleSubmitGet = (e) => {
    e.preventDefault();
    CosmosGetPython(cGet)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    SendName(input);
    CosmosPostNode(input);
  };

  const handleChange = (e) => {
    setinput(e.target.value);
  };
  ///////////////////
  const handleSubmitblob = (e) => {
    e.preventDefault();
    GetName(blob);
  };
  const handleChangeblob = (e) => {
    setblob(e.target.value);
  };
  /////////////////////
  const [handle, sethandle] = useState("");
  const handleChangeCosmosPython = (e) => {
    sethandle(e.target.value);
  };
  const handleSubmitPython = (e) => {
    e.preventDefault();
    CosmosPostPython(handle);
    // window.location.reload();
  };
  /////////////////
  const handleSubmitPythonblob = (e) => {
    e.preventDefault();
    HttpBlobGetPython(handleblob);
  };
  const [handleblob, sethandleblob] = useState([]);
  const handleChangePythonblob = (e) => {
    sethandleblob(e.target.value);
  };
  ////////////////
  const [handleblobpost, sethandleblobpost] = useState([]);
  const handleChangePythonblobpost = (e) => {
    sethandleblobpost(e.target.value);
  };
  const handleSubmitPythonblobpost = (e) => {
    e.preventDefault();
    HttpBlobPostPython(handleblobpost);
  };
  ////////////////
  const [handlecosmosdelete, sethandlecosmosdelete] = useState([]);
  const handleChangehandlecosmosdelete = (e) => {
    sethandlecosmosdelete(e.target.value);
  };
  const handleSubmithandlecosmosdelete = (e) => {
    e.preventDefault();
    HttpCosmosDeleteUser(handlecosmosdelete);
  };
  ////////////////
  const [handleblobdelete, sethandleblobdelete] = useState([]);
  const handleChangehandleblobdelete = (e) => {
    sethandleblobdelete(e.target.value);
  };
  const handleSubmithandleblobdelete = (e) => {
    e.preventDefault();
    HttpCosmosDeleteUser(handleblobdelete);
  };
  ////////////////
  
  return (
    <div className="App">
      <div>Node Functions</div>
      <form onSubmit={handleSubmit}>
        <label>Enter your Name </label>
        <input onChange={handleChange}></input>
        <input type="submit"></input>
      </form>
      {ResdData}
      <div>
        <h3>cosmos node get</h3>
      </div>
      {cosmosGetData}
      <br></br>
      <div>blob get data</div>
      <form onSubmit={handleSubmitblob}>
        <input type="text" onChange={handleChangeblob}></input>
        <input type="submit"></input>
      </form>
      {UserData}
      <br></br>
      <br></br>
      <div>Python Function </div>
      <div>
        <label>Get by id name of cosmosdb item</label>
        <br></br>
        <br></br>
        <div>
        <form onSubmit={handleSubmitGet}>
        <input type="text" onChange={handleChangeGet}></input>
        <input type="submit"></input>
      </form>
        </div>
        <div>{cosmosGetPython}</div>
      </div>
      <br></br>
      <form onSubmit={handleSubmitPython}>
        <label>post cosmos </label>
        <br></br>
        <input type="text" onChange={handleChangeCosmosPython}></input>
        <br></br>
        <input type="submit"></input>
      </form>
      <div>{cosmosPostPython}</div>
      <div>
        {/* blob get , post */}
        <form onSubmit={handleSubmitPythonblob}>
          <label>get blob </label>
          <br></br>
          <input type="text" onChange={handleChangePythonblob}></input>
          <br></br>
          <input type="submit"></input>
        </form>
        {HttpBlobGPython}
      </div>
      <div>
        <form onSubmit={handleSubmitPythonblobpost}>
          <label>post blob </label>
          <br></br>
          <input type="text" onChange={handleChangePythonblobpost}></input>
          <br></br>
          <input type="submit"></input>
        </form>
        {HttpBlobPPython}
      </div>
      <div>
        <form onSubmit={handleSubmithandlecosmosdelete}>
          <label>delete item by name </label>
          <br></br>
          <input type="text" onChange={handleChangehandlecosmosdelete}></input>
          <br></br>
          <input type="submit"></input>
        </form>
      </div>
      <div>
        <button onClick={HttpCosmosDeleteAll}>
          Click for Delete all Items in Cosmos
        </button>
      </div>
      <div>
        <form onSubmit={handleSubmithandleblobdelete}>
          <label>delete blob by name </label>
          <br></br>
          <input type="text" onChange={handleChangehandleblobdelete}></input>
          <br></br>
          <input type="submit"></input>
        </form>
      </div>
    </div>
  );
};

export default App;
