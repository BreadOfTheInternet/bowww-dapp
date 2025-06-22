// app.js
const contractAddress = "0x284414b6777872E6DD8982394Fed1779dc87a3Cf";
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
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask is not installed. Please use MetaMask browser or install it.");
    return;
  }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    document.getElementById("status").innerText = "✅ Wallet Connected";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Connection failed";
  }
}

async function buy() {
  const amount = document.getElementById("maticAmount").value;
  if (!amount || !signer) {
    alert("Please enter amount and connect wallet.");
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
      `✅ Transaction Sent! <a href='https://polygonscan.com/tx/${tx.hash}' target='_blank'>View on Polygonscan</a>`;
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Transaction Failed: " + err.message;
  }
}