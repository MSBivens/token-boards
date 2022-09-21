import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { useViewerRecord } from "@self.id/react";
import styles from "../styles/resume.module.css";
import Layout from "../components/Layout";

function Home() {
  const [connection, connect, disconnect] = useViewerConnection();
  const web3ModalRef = useRef();

  const connectToSelfID = async () => {
    const ethereumAuthProvider = await getEthereumAuthProvider();
    connect(ethereumAuthProvider);
  };

  const getEthereumAuthProvider = async () => {
    const wrappedProvider = await getProvider();
    const signer = wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  };

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const wrappedProvider = new Web3Provider(provider);
    return wrappedProvider;
  };

  useEffect(() => {
    if (connection.status !== "connected") {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [connection.status]);

  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}>Resume</span>
        {connection.status === "connected" ? (
          <span className={styles.subtitle}>Connected</span>
        ) : (
          <button
            onClick={connectToSelfID}
            className={styles.button}
            disabled={connection.status === "connecting"}
          >
            Connect
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.connection}>
          {connection.status === "connected" ? (
            <div>
              <span className={styles.subtitle}>
                Your 3ID is {connection.selfID.id}
              </span>
              <RecordSetter />
            </div>
          ) : (
            <span className={styles.subtitle}>
              Connect with your wallet to access your 3ID
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordSetter() {
  const [name, setName] = useState("");
  const [twitter, setTwitter] = useState("");
  const record = useViewerRecord("basicProfile");

  console.log(record);
  const updateRecordName = async (name) => {
    await record.merge({
      name: name,
    });
  };
  const updateRecordTwitter = async (twitter) => {
    await record.merge({
      twitter: twitter,
    });
  };

  return (
    <Layout>
      <div className={styles.content}>
        <div className={styles.mt2}>
          {record.content ? (
            <div className={styles.flexCol}>
              <span className={styles.subtitle}>
                Hello {record.content.name}! Twitter Handle:{" "}
                {record.content.twitter}
              </span>

              <span>
                The above name was loaded from Ceramic Network. Try updating it
                below.
              </span>
            </div>
          ) : (
            <span>
              You do not have a profile stream attached to your 3ID. Create a
              basic profile by setting a name below.
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.mt2}
        />
        <input
          type="text"
          placeholder="Twitter Handle"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className={styles.mt2}
        />
        <button
          onClick={() => {
            updateRecordName(name);
            updateRecordTwitter(twitter);
          }}
        >
          Update
        </button>
      </div>
    </Layout>
  );
}

export default Home;
