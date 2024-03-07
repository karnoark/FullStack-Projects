import { useEffect, useState } from "react";
import "./App.css";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");
  const [balance, setBalance] = useState(0);
  // const [newBalance, setNewBalance] = useState(0);

  useEffect(() => {
    getTransactions().then((transactions) => {
      setTransactions(transactions);
      updateBalance(transactions)
    });
  }, [transactions]);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return response.json();
  }

  function addNewTransaction(event) {
    console.log("the form is submitted");
    event.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    // console.log("this is the url: ", url)
    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setName("");
        setDatetime("");
        setDescription("");
      })
      .catch((error) => console.log("this is the error we got: ", error));
  }

  function deleteTransaction(objid) {
    console.log("the following tranction has been deleted", objid);
    const url = process.env.REACT_APP_API_URL + "/transactions/" + objid;

    fetch(url, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log("following is the error I got: ", err));
  }


  // function balanceReset() {
  //   console.log("balance reset");
  //   setBalance(newBalance)
  // }

  function updateBalance(transactions) {
    let finalBalance = 0;
    for (const transaction of transactions) {
      finalBalance += transaction.price;
    }
    setBalance(finalBalance);
  }

  return (
    <main>
      <h1>{balance}₹</h1>

      {/* form */}
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="+2000 for keyboard"
          ></input>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          ></input>
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
          ></input>
        </div>
        <button type="submit">Add new transaction</button>
      </form>

      {/* Balance Reset Button */}
      {/* <div className="resetBalance">
      <input
        type="Number"
        onChange={(e) => {
          console.log("this is the value: ", e.target.value);
          setNewBalance(Number(e.target.value))
        }}
        placeholder="Reset the Balance"
      ></input>

      <button className="reset-button" onClick={balanceReset}>Reset the balance</button>
      </div> */}

      {/* transactions */}
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div>
              <div className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      "price " + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
                {/* <button>Delete</button> */}
                <div className="delete-icon">
                  <DeleteIcon
                    onClick={() => {
                      deleteTransaction(transaction._id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
