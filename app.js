let provider;
let signer;
const contractAddress = "0x406FE62Bc4dCE3c9B255C4Ba69f28Cb795A41BA0";
const abi = [
  // Replace this with your token sale or ERC20 ABI
  // For now, a placeholder function to simulate
  "function transfer(address to, uint amount) public returns (bool)"
];

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      alert("Wallet connected");
    } catch (err) {
      console.error("User denied wallet access", err);
    }
  } else {
    alert("MetaMask not detected");
  }
}

async function buyBOWWW() {
  if (!signer) return alert("Please connect your wallet first.");

  const maticAmount = document.getElementById("amount").value;
  if (!maticAmount || isNaN(maticAmount)) return alert("Enter a valid amount");

  const bowwwAmount = maticAmount * 369;
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const recipient = "0xYourAdminWalletAddressHere"; // Replace this!
    const tx = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(maticAmount.toString())
    });

    await tx.wait();
    alert(`Success! You bought ${bowwwAmount} BOWWW`);
  } catch (err) {
    console.error("Transaction failed", err);
    alert("Transaction failed");
  }
}
