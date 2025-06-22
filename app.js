let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0x284414b6777872E6dD8982394Fed1779dc87a3cF";
const ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

async function connect() {
  const statusMsg = document.getElementById("status-message");
  const walletAddr = document.getElementById("wallet-address");

  try {
    if (typeof window.ethereum === "undefined") {
      statusMsg.textContent = "❌ MetaMask is not installed.";
      return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    walletAddr.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
    walletAddr.style.color = "green";

    // Optional: Fetch and display wallet balance
    const balance = await provider.getBalance(address);
    const formatted = ethers.utils.formatEther(balance);
    document.getElementById("rate-display").textContent = `Balance: ${formatted} MATIC`;

    // Load contract
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  } catch (err) {
    console.error(err);
    statusMsg.textContent = "❌ Wallet connection failed: " + err.message;
  }
}

async function buy() {
  const statusMsg = document.getElementById("status-message");
  const amountInput = document.getElementById("amount-input");
  const amount = amountInput.value.trim();

  if (!provider || !signer || !contract) {
    statusMsg.textContent = "❌ Connect wallet first.";
    return;
  }

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    statusMsg.textContent = "❌ Enter a valid amount.";
    return;
  }

  try {
    statusMsg.textContent = "⏳ Sending transaction...";
    const decimals = await contract.decimals();
    const value = ethers.utils.parseEther(amount);

    // Send MATIC to token contract address (if it's set to receive it)
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: value
    });

    await tx.wait();

    statusMsg.innerHTML = `✅ Purchase successful!<br><a href="https://polygonscan.com/tx/${tx.hash}" target="_blank">View on Polygonscan</a>`;
  } catch (err) {
    console.error(err);
    statusMsg.textContent = `❌ Transaction failed: ${err.message}`;
  }
}

