import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import web3 from "./web3";
import lottery from "./lottery";
import { send } from "process";

class App extends Component {
  state = {
    manager: [
      "0x153dfef4355E823dCB0FCc76Efe942BefCa86477",
      "0xDc802466C9Eaf069c81Be9A4a6Fbe9aA952cd52d",
    ],
    players: [],
    balance: "",
    value: "",
    carBids: 0,
    phoneBids: 0,
    laptopBids: 0,
    message: "Here you will see all new messages!",
    lotteryStatus: "-",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  declareWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    window.alert("Waiting on transaction success...");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    window.alert("A winner has been picked!");
  };

  amIWinner = async () => {
    const winners = await web3.eth.getWinners();
    var won = 0;
    for (var i = 0; i < winners.length; i++) {
      if (winners[i] == this.state.address) {
        this.setState({ message: "You are the winner of item" + i });
        won = 1;
      }
    }
    if (won == 0) {
      this.setState({ message: "You haven't won any items." });
    }
  };

  withdraw = async () => {
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.withdraw().send({
      from: accounts[0],
      value: this.state.balance,
    });
    window.alert("Withdraw Completed");
  };

  reveal = async () => {
    document.getElementById("carBid").textContent = this.state.carBids;
    document.getElementById("phoneBid").textContent = this.state.phoneBids;
    document.getElementById("laptopBid").textContent = this.state.laptopBids;
  };

  bidCar = async () => {
    const accounts = await web3.eth.getAccounts();
    var result = parseInt(document.getElementById("carBid").textContent);
    result = result + 1;
    document.getElementById("carBid").textContent = result;
    this.setState({ message: "You made a new bid for a Car" });

    var c = this.state.carBids;
    c = c + 1;
    this.setState({ carBids: c });
  };

  bidPhone = async () => {
    const accounts = await web3.eth.getAccounts();
    var result = parseInt(document.getElementById("phoneBid").textContent);
    result = result + 1;
    document.getElementById("phoneBid").textContent = result;
    this.setState({ message: "You made a new bid for a Phone" });

    var p = this.state.phoneBids;
    p = p + 1;
    this.setState({ phoneBids: p });
  };

  bidLaptop = async () => {
    const accounts = await web3.eth.getAccounts();

    var result = parseInt(document.getElementById("laptopBid").textContent);
    result = result + 1;
    document.getElementById("laptopBid").textContent = result;
    this.setState({ message: "You made a new bid for a Laptop" });

    var l = this.state.laptopBids;
    l = l + 1;
    this.setState({ laptopBids: l });
  };

  render() {
    return (
      <div>
        <h1>Lottery - Ballot</h1>

        <div className="images-group">
          <div className="content-box">
            <div className="image-title">
              <label className="label-text" htmlFor="Car Image">
                Car
              </label>
            </div>
            <img
              className="image-block"
              src="https://wallpaperaccess.com/full/5416591.jpg"
              alt="White Lamborghini"
            />
            <div className="bottom-box">
              <button
                className="bid-button"
                type="button"
                onClick={this.bidCar}
              >
                Bid
              </button>
              <label className="price-label" htmlFor="Price" id="carBid">
                0
              </label>
            </div>
          </div>
          <div className="content-box">
            <div className="image-title">
              <label className="label-text" htmlFor="Phone Image">
                Phone
              </label>
            </div>
            <img
              className="image-block"
              src="https://media.istockphoto.com/photos/perspective-view-silver-apple-iphone-x-back-side-isolated-on-white-picture-id919528154?k=20&m=919528154&s=170667a&w=0&h=7ZaeskKeXS3pj05DsaHT3rDjJ6LMD6Pnp2jBh5IW2Io="
              alt="White Iphone"
            />
            <div className="bottom-box">
              <button
                className="bid-button"
                type="button"
                onClick={this.bidPhone}
              >
                Bid
              </button>
              <label className="price-label" htmlFor="Price" id="phoneBid">
                0
              </label>
            </div>
          </div>
          <div className="content-box">
            <div className="image-title">
              <label className="label-text" htmlFor="Laptop Image">
                Laptop
              </label>
            </div>
            <img
              className="image-block"
              src="https://cdn.plaisio.gr/mms/Product-Images/PlaisioGr/3/8/9/9/9/1/8/3899918_3.jpg"
              alt="Silver Laptop"
            />
            <div className="bottom-box">
              <button
                className="bid-button"
                type="button"
                onClick={this.bidLaptop}
              >
                Bid
              </button>
              <label className="price-label" htmlFor="Price" id="laptopBid">
                0
              </label>
            </div>
          </div>
        </div>

        <div className="htmlForm-group">
          <div className="htmlForm-box">
            <label htmlFor="Sender Address">Current Account (ETH) :</label>
            <input
              value=""
              type="text"
              className="htmlForm-control"
              id="fromAddress"
              aria-describedby="fromAddressHelp"
              placeholder="Enter the sender's address"
              required={true}
            />
          </div>

          <div className="htmlForm-box">
            <label htmlFor="Receiver Address">Owner's Accounts (ETH) :</label>
            <input
              value="0xbCA06c02Bbc976c5e531dED17FF2f5b032844974"
              type="text"
              className="htmlForm-control"
              id="toAddress"
              aria-describedby="toAddressHelp"
              placeholder="Enter the owner's address"
              required={true}
            />
            <input
              value="0x153dfef4355E823dCB0FCc76Efe942BefCa86477"
              type="text"
              className="htmlForm-control"
              id="toAddress"
              aria-describedby="toAddressHelp"
              placeholder="Enter the owner's address"
              required={true}
            />
          </div>
        </div>

        <div className="bottom-group">
          <div className="top-buttons">
            <button className="left-button" type="button" onClick={this.reveal}>
              Reveal
            </button>
            <button
              className="right-button"
              type="button"
              onClick={this.withdraw}
            >
              Withdraw
            </button>
          </div>
          <div className="bottom-buttons">
            <button
              className="left-button"
              type="button"
              onClick={this.amIWinner}
            >
              Am I Winner
            </button>
            <button
              className="right-button"
              type="button"
              onClick={this.declareWinner}
            >
              Declare Winner
            </button>
          </div>
        </div>

        <h4>{this.state.message}</h4>
      </div>
    );
  }
}

export default App;
