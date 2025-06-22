const contractAddress = "0x284414b6777872E6DD8982394Fed1779dc87a3Cf";
const abi = [
  "function buyBowww() payable",
  "function rate() view returns (uint)",
  "function withdrawMatic()",
  "function withdrawTokens()",
  "function updateRate(uint newRate)",
  "function bowwwToken() view returns (address)"
];

let provider, signer, contract, userAddress;

document.addEventListener("DOMContentLoaded", () => {
  console.log("MetaMask available?", typeof window.ethereum !== "undefined");
  document.querySelector("button[onclick='buy()']").disabled = true;

  if (!window.ethereum) {
    document.getElementById("status").innerHTML = "❌ MetaMask not detected. Please install MetaMask.";
  }
});

async function connect() {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed");
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);

    const currentRate = await contract.rate();
    document.getElementById("status").innerHTML = `✅ Connected: ${userAddress}`;
    document.getElementById("rate-info").innerText = `Current Rate: 1 MATIC = ${currentRate.toString()} BOWWW`;
    document.querySelector("button[onclick='buy()']").disabled = false;

    console.log("Wallet connected:", userAddress);
  } catch (err) {
    console.error("Connection error:", err);
    document.getElementById("status").innerText =
      "❌ " + (err.message || "Connection failed. Please unlock MetaMask.");
  }
}

async function buy() {
  const amount = document.getElementById("amount").value;
  if (!amount || !signer) {
    alert("Please enter an amount and connect your wallet.");
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(amount)
    });

    document.getElementById("status").innerText = "⏳ Waiting for confirmation...";
    await tx.wait();
    document.getElementById("status").innerHTML =
      `✅ Transaction Confirmed! <a href='https://polygonscan.com/tx/${tx.hash}' target='_blank'>View on Polygonscan</a>`;
  } catch (err) {
    console.error("Transaction error:", err);
    document.getElementById("status").innerText =
      "❌ Transaction Failed: " + (err.message || "Unknown error");
  }
}

function launchInMetaMask() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const dappURL = "breadoftheinternet.github.io/bowww-dapp/";
  const fullLink = "https://metamask.app.link/dapp/" + dappURL;

  if (isMobile) {
    window.location.href = fullLink;
  } else {
    alert("This only works in the MetaMask mobile browser.");
  }
}


