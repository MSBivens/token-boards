import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import Layout from "../components/Layout";
import { hasEthereum, requestAccount } from "../utils/hasEthereum";
import { ethers } from "ethers";
import Board from "../components/publicJobs";
import PublicJobBoard from "../PublicJobBoard.json";
import { useState, useEffect } from "react";

function Siwe() {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [PublicJobsState, setPublicJobsState] = useState();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    try {
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    if (!hasEthereum()) {
      notify("error", "MetaMask unavailable");
      setConnectedWalletAddressState(`MetaMask unavailable`);
      setLoading(false);
      return;
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        await requestAccount();
        const signerAddress = await signer.getAddress();
        console.log("HEYYY", signerAddress);
        setConnectedWalletAddressState(signerAddress);
      } catch {
        console.log("ERROR");
        setConnectedWalletAddressState("No wallet connected");
        return;
      }
    }
    // setConnectedWalletAddress();
    getAdmin();
    fetchPublicJobs();
  }, []);

  async function getAdmin() {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    await requestAccount();
    // @ts-ignore: will return to solve
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      // @ts-ignore: will return to solve
      PublicJobBoard.address,
      PublicJobBoard.abi,
      provider
    );
    try {
      const data = await contract.admin();
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      if (data == signerAddress) {
        console.log("HELLO ADMIN");
        setIsAdmin(true);
      }
    } catch (error) {
      console.log("ERROR IN ADMIN");
      console.log(error);
    }
  }

  async function fetchPublicJobs() {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    // @ts-ignore: will return to solve
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      // @ts-ignore: will return to solve
      PublicJobBoard.address,
      PublicJobBoard.abi,
      provider
    );
    try {
      // await requestAccount();
      const data = await contract.viewPublicJobs();
      console.log("Public JOBS", data);
      setPublicJobsState(data);
    } catch (error) {
      console.log("HERE IS BIG ERROR IN ALL JOBS");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Layout>
      {address ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          Sign-in
        </button>
      ) : (
        <ConnectButton />
      )}
      {loading ? (
        <div className="loader-center">
          <div className="loader"></div>
        </div>
      ) : (
        PublicJobsState &&
        // @ts-ignore: will return to solve
        PublicJobsState.map(
          // @ts-ignore: will return to solve
          (publicJob, index) =>
            publicJob.employer !=
              "0x0000000000000000000000000000000000000000" && (
              <div key={index}>
                <Board
                  id={index}
                  companyName={publicJob.companyName}
                  position={publicJob.position}
                  employmentType={publicJob.employmentType}
                  location={publicJob.location}
                  companyUrl={publicJob.companyUrl}
                />
                <div style={{ marginTop: "15px" }}></div>
              </div>
            )
        )
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

Siwe.Layout = Layout;

export default Siwe;
