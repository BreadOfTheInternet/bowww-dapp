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

// Disable buy button until wallet is connected
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button[onclick='buy()']").disabled = true;
});

async function connect() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask is not installed. Please use MetaMask browser or install it.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);

    // Show wallet address and enable Buy button
    document.getElementById("status").innerHTML = `✅ Connected: <span style="font-size: 0.9rem">${userAddress}</span>`;
    document.querySelector("button[onclick='buy()']").disabled = false;

    // Show rate
    const currentRate = await contract.rate();
    document.getElementById("rate-info").innerText = `Current Rate: 1 MATIC = ${currentRate.toString()} BOWWW`;

  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Connection failed";
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
    document.getElementById("status").innerText = "❌ Transaction Failed: " + err.message;
  }
}


