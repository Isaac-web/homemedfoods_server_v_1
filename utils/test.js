const axios = require("axios");

const getUsers = async () => {
  const res = await axios.get("http://alxtakiy.tech/api/users");
  console.log(res.status);
  console.log(res.data);
};

const getChecks = async () => {
  axios.interceptors.request.use((req) => {
    req.headers["Authorization"] =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MzM5MzY0MSwianRpIjoiMzZiMGUyMTItYjY5NS00NTk2LTk1YTctMDQzNDlmNDQ2Y2M3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6NCwibmJmIjoxNjczMzkzNjQxfQ.i4HmlUXiPLjuqUQVZP34-fM7Uh-OKBa-dXdxs8LDVeI";
    return req;
  });
  const res = await axios.get("http://alxtakiy.tech/api/checks");
  console.log(res.status);
  console.log(res.data);
};

const createUser = async () => {
  try {
    const res = await axios.post("http://alxtakiy.tech/api/users", {
      firstname: "Isaac",
      lastname: "Kanyiti",
      email: "kanytakiy@gmail.com",
      phone: "0553039567",
      password: "password",
    });
    console.log(res.status);
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err.data);
    }
  }
};

const signIn = async () => {
  try {
    const res = await axios.post("http://alxtakiy.tech/api/users/login", {
      email: "kanytakiy@gmail.com",
      password: "password",
    });
    console.log(res.status);
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err.data);
    }
  }
};

getChecks();
// getUsers();
// createUser();
// signIn();
