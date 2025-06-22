// ✅ Updated app.js for BOWWW Swap DApp
const contractAddress = "0x284414b6777872E6DD8982394Fed1779dc87a3Cf"; // Swap contract address
const abi = [
  "function buyBowww() payable",
  "function rate() view returns (uint)",
  "function withdrawMatic()",
  "function withdrawTokens()",
  "function updateRate(uint newRate)",
  "function bowwwToken() view returns (address)"
];

let provider, signer, contract;

async function connect() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    document.getElementById("status").innerText = "✅ Wallet connected.";
  } else {
    alert("Please install MetaMask");
  }
}

async function buy() {
  const amount = document.getElementById("amount").value;
  if (!amount || !signer) {
    document.getElementById("status").innerText = "❌ Enter amount and connect wallet.";
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(amount)
    });
    document.getElementById("status").innerText = "✅ Transaction sent. Waiting for confirmation...";
    const receipt = await tx.wait();
    document.getElementById("status").innerHTML =
      `✅ Transaction Confirmed!<br>View on <a href='https://polygonscan.com/tx/${receipt.transactionHash}' target='_blank'>Polygonscan</a>`;
  } catch (err) {
    document.getElementById("status").innerText = "❌ Error: " + err.message;
  }
}