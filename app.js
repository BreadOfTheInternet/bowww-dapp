let userAccount;

const connectButton = document.getElementById("connectWallet");
const buyButton = document.getElementById("buyButton");
const maticAmountInput = document.getElementById("maticAmount");
const messageDiv = document.getElementById("message");

const tokenAddress = "0x046FE62Bc4dCE3c9B255c48a69f28Cb795A418A0";
const receiverAddress = "0x046FE62Bc4dCE3c9B255c48a69f28Cb795A418A0"; // Adjust if needed

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      userAccount = accounts[0];
      connectButton.innerText = "Wallet Connected";
      connectButton.disabled = true;
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  } else {
    alert("MetaMask is not installed. Please use MetaMask to continue.");
  }
}

async function buyTokens() {
  const amount = maticAmountInput.value;
  if (!userAccount || !amount || isNaN(amount) || Number(amount) <= 0) {
    messageDiv.innerHTML = "❌ Enter amount and connect wallet.";
    return;
  }

  const amountInWei = BigInt(Math.floor(Number(amount) * 1e18)).toString();
  try {
    const tx = await ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: userAccount,
        to: receiverAddress,
        value: "0x" + BigInt(amountInWei).toString(16),
      }],
    });

    messageDiv.innerHTML = `✅ Transaction Sent!<br>
      <a href="https://polygonscan.com/tx/${tx}" target="_blank" style="color:#6a0dad;">
        View on Polygonscan
      </a>`;
  } catch (err) {
    console.error("Transaction error:", err);
    messageDiv.innerHTML = "❌ Transaction cancelled or failed.";
  }
}

connectButton.addEventListener("click", connectWallet);
buyButton.addEventListener("click", buyTokens);