window.addEventListener('DOMContentLoaded', () => {
  const connectBtn = document.getElementById('connect-btn');
  const status = document.getElementById('status');

  connectBtn.addEventListener('click', async () => {
    // Clear any previous status
    status.textContent = 'Connecting…';

    // Check for MetaMask / window.ethereum
    if (typeof window.ethereum === 'undefined') {
      status.textContent = '❌ MetaMask not detected. Please install it.';
      return;
    }

    try {
      // Prompt user to connect their wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); 
      const signer = provider.getSigner();

      // Get the connected address
      const address = await signer.getAddress();
      status.textContent = `✅ Connected: ${address}`;

      // (Optional) Lock the button so they don't click twice
      connectBtn.disabled = true;
      connectBtn.textContent = 'Connected';

    } catch (err) {
      console.error(err);
      status.textContent = `❌ Connection failed: ${err.message}`;
    }
  });
});


