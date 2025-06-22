const contractAddress = "0x284414b6777872E6DD8982394Fed1779dc87a3Cf"; // BowwwSwap contract
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
    alert("Please install MetaMask to use this dApp.");
  }
}

async function buy() {
  const amount = document.getElementById("amount").value;
  if (!amount || !signer) {
    alert("Please enter a MATIC amount and connect wallet.");
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(amount)
    });

    document.getElementById("status").innerText = "✅ Transaction sent. Waiting for confirmation...";
    await tx.wait();

    const txHash = tx.hash;
    document.getElementById("status").innerHTML = `
      ✅ Transaction successful!<br>
      <a href="https://polygonscan.com/tx/${txHash}" target="_blank">View on Polygonscan</a>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error: " + (err.message || "Transaction failed");
  }
}