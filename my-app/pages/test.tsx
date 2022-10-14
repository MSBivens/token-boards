// Components
import Layout from "../components/Layout";
// import Board from "../components/publicJobs";
// import PublicJobBoard from "../PublicJobBoard.json";

//Imports
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
import { useCallback, useEffect, useReducer } from "react";
import WalletLink from "walletlink";
import Web3Modal from "web3modal";
import { ellipseAddress, getChainData } from "../lib/utilities";

const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  "custom-walletlink": {
    display: {
      logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
      name: "Coinbase",
      description: "Connect to Coinbase Wallet (not Coinbase App)",
    },
    options: {
      appName: "Coinbase", // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: false,
    providerOptions, // required
  });
}

type StateType = {
  provider?: any;
  web3Provider?: any;
  address?: string;
  chainId?: number;
};

type ActionType =
  | {
      type: "SET_WEB3_PROVIDER";
      provider?: StateType["provider"];
      web3Provider?: StateType["web3Provider"];
      address?: StateType["address"];
      chainId?: StateType["chainId"];
    }
  | {
      type: "SET_ADDRESS";
      address?: StateType["address"];
    }
  | {
      type: "SET_CHAIN_ID";
      chainId?: StateType["chainId"];
    }
  | {
      type: "RESET_WEB3_PROVIDER";
    };

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    default:
      throw new Error();
  }
}

export const Test = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, address, chainId } = state;

  const connect = useCallback(async function () {
    const provider = await web3Modal.connect();

    const web3Provider = new providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    console.log("SET ADDRESS FROM CONNECT", address);
    const network = await web3Provider.getNetwork();

    dispatch({
      type: "SET_WEB3_PROVIDER",
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    },
    [provider]
  );

  // Auto connect to the cached provider
  useEffect(() => {
    console.log("web3Modal.cachedProvider", web3Modal.cachedProvider);
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged from event", accounts);
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const chainData = getChainData(chainId);

  return (
    <div>
      <Layout>
        <div className="container">
          <header>
            {address && (
              <div className="grid">
                <div>
                  <p className="mb-1">Network:</p>
                  <p>{chainData?.name}</p>
                </div>
                <div>
                  <p className="mb-1">Address:</p>
                  <p>{ellipseAddress(address)}</p>
                </div>
              </div>
            )}
          </header>

          <main>
            {web3Provider ? (
              // Put Job Board here
              <button className="button" type="button" onClick={disconnect}>
                Disconnect
              </button>
            ) : (
              <button className="button" type="button" onClick={connect}>
                Connect To View Jobs
              </button>
            )}
          </main>

          <style jsx>{`
            main {
              padding: 5rem 0;
              text-align: center;
            }

            p {
              margin-top: 0;
            }

            .container {
              padding: 2rem;
              margin: 0 auto;
              max-width: 1200px;
            }

            .grid {
              display: grid;
              grid-template-columns: auto auto;
              justify-content: space-between;
            }

            .button {
              padding: 1rem 1.5rem;
              background: ${web3Provider ? "red" : "green"};
              border: none;
              border-radius: 0.5rem;
              color: #fff;
              font-size: 1.2rem;
            }

            .mb-0 {
              margin-bottom: 0;
            }
            .mb-1 {
              margin-bottom: 0.25rem;
            }
          `}</style>
        </div>
      </Layout>
    </div>
  );
};

export default Test;
