const contractAddress = "0x046FE62Bc4dCE3c9B255c48a69f28Cb795A418A0";
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
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      document.getElementById("status").innerText = "✅ Wallet connected.";
    } catch (err) {
      document.getElementById("status").innerText = "❌ Wallet connection failed.";
    }
  } else {
    alert("Please install MetaMask.");
  }
}

async function buy() {
  const amount = document.getElementById("amount").value;
  if (!amount || !signer) {
    alert("Enter amount and connect wallet first.");
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(amount)
    });

    document.getElementById("status").innerText = "⏳ Waiting for confirmation...";
    await tx.wait();

    document.getElementById("status").innerHTML = `
      ✅ Transaction sent!<br>
      <a href="https://polygonscan.com/tx/${tx.hash}" target="_blank">View on Polygonscan</a>
    `;
  } catch (err) {
    document.getElementById("status").innerText = "❌ Transaction failed: " + err.message;
  }
}