const contractAddress = "0x046FE62Bc4dCE3c9B255c48a69f28Cb795A418A0";

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 137) {
        alert("Please switch to the Polygon Mainnet (chainId: 137)");
      } else {
        alert("Wallet connected!");
      }
    } catch (error) {
      console.error("User rejected the request:", error);
    }
  } else {
    alert("MetaMask is not installed!");
  }
}

async function buy() {
  const amountInput = document.getElementById("amount").value;
  if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
    alert("Please enter a valid MATIC amount");
    return;
  }

  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask first!");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(amountInput),
    });

    alert(`Transaction sent! Hash:\n${tx.hash}`);
  } catch (err) {
    console.error(err);
    alert("Transaction failed. Check console for details.");
  }
}