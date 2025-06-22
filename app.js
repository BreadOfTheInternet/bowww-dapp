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
  const buyBtn = document.querySelector("button[onclick='buy()']");
  buyBtn.disabled = true;

  if (!window.ethereum) {
    document.getElementById("status").innerHTML = "❌ MetaMask not detected. Please install the extension.";
  }
});

async function connect() {
  if (!window.ethereum) {
    alert("MetaMask not found. Please install MetaMask extension.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById("status").innerHTML =
      `✅ Connected: <span style="font-size: 0.9rem">${userAddress}</span>`;
    document.querySelector("button[onclick='buy()']").disabled = false;

    const currentRate = await contract.rate();
    document.getElementById("rate-info").innerText =
      `Current Rate: 1 MATIC = ${currentRate.toString()} BOWWW`;
  } catch (err) {
    console.error("Connection Error:", err);
    if (err.code === 4001) {
      document.getElementById("status").innerText = "❌ User rejected connection.";
    } else {
      document.getElementById("status").innerText =
        "❌ Connection failed. Make sure MetaMask is unlocked and try again.";
    }
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
    console.error("Transaction Error:", err);
    document.getElementById("status").innerText =
      "❌ Transaction Failed: " + (err.message || "Unknown error");
  }
}



