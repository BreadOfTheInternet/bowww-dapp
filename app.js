// app.js

let provider;
let signer;

async function connect() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      document.getElementById('status').innerText = '✅ Wallet Connected';
      document.getElementById('status').style.color = 'green';
    } catch (err) {
      console.error('User rejected connection', err);
    }
  } else {
    alert('Please install MetaMask to use this feature.');
  }
}

async function buy() {
  const amountInput = document.getElementById('amount');
  const amount = amountInput.value;

  if (!amount || !signer) {
    showError('❌ Enter amount and connect wallet.');
    return;
  }

  try {
    const contractAddress = '0x046FE62Bc4dCE3c9B255c48a69f28Cb795A418A0';
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(amount)
    });

    showSuccess(`✅ Transaction Sent! <br><a href="https://polygonscan.com/tx/${tx.hash}" target="_blank">View on Polygonscan</a>`);
  } catch (err) {
    console.error('Transaction failed', err);
    showError('❌ Transaction Failed');
  }
}

function showSuccess(message) {
  const status = document.getElementById('status');
  status.innerHTML = message;
  status.style.color = 'green';
}

function showError(message) {
  const status = document.getElementById('status');
  status.innerHTML = message;
  status.style.color = 'red';
}