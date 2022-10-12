// Components
import Layout from "../components/Layout";
// import Board from "../components/publicJobs";
// import PublicJobBoard from "../PublicJobBoard.json";

//Imports
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

function Test() {
  const domain = window.location.host;
  const origin = window.location.origin;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  function createSiweMessage(address, statement) {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: "1",
      chainId: "1",
    });
    return message.prepareMessage();
  }

  function connectWallet() {
    provider
      .send("eth_requestAccounts", [])
      .catch(() => console.log("user rejected request"));
  }

  async function signInWithEthereum() {
    const message = createSiweMessage(
      await signer.getAddress(),
      "Sign in with Ethereum to the app."
    );
    console.log(await signer.signMessage(message));
  }

  const connectWalletBtn = document.getElementById("connectWalletBtn");
  const siweBtn = document.getElementById("siweBtn");
  connectWalletBtn.onclick = connectWallet;
  siweBtn.onclick = signInWithEthereum;

  return (
    <div>
      <Layout>
        <div>
          <button id="connectWalletBtn">Connect wallet</button>
        </div>
        <div>
          <button id="siweBtn">Sign-in with Ethereum</button>
        </div>
      </Layout>
    </div>
  );
}

export default Test;
