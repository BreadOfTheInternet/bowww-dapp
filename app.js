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
  document.querySelector("button[onclick='buy()']").disabled = true;

  if (typeof window.ethereum !== 'undefined') {
    ethereum.request({ method: "eth_accounts" })
      .then(accounts => {
        if (accounts.length > 0) {
          connect();
        }
      });
  } else {
    document.getElementById("status").innerText = "❌ MetaMask not detected.";
  }
});

async function connect() {
  if (typeof window.ethereum === 'undefined') {
    alert("❌ MetaMask not detected. Please install MetaMask and avoid Incognito.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned from MetaMask.");
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
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
    console.error(err);
    document.getElementById("status").innerText =
      "❌ Wallet connection failed: " + err.message;
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
    console.error(err);
    document.getElementById("status").innerText =
      "❌ Transaction Failed: " + err.message;
  }
}


