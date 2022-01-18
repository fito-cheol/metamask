<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col cols="12" v-if="!isMetaMask">
        <v-btn @click="installMetaMask"> 메타마스크 설치하기 </v-btn>
      </v-col>
      <v-col cols="12">
        <span>
          {{
            isEther
              ? `Ether Connected to ${connectNetwork}`
              : `Ether Not Connected`
          }}
        </span>
      </v-col>
      <v-col class="mb-4 ml-2" cols="12">
        <v-btn @click="connectEther"> Connect Ether </v-btn>
      </v-col>
      <v-col class="mb-4" v-if="isEther" cols="12">
        <v-btn @click="checkAccount"> Get Account </v-btn>
        <span> My Account: {{ account }}</span>
      </v-col>
      <v-col class="mb-4" v-if="account" cols="12">
        <v-btn @click="getBalance" color="green" class="ma-2">
          Get Balance
        </v-btn>
        <v-btn @click="getGasPrice" color="green" class="ma-2">
          Get GasPrice
        </v-btn>
        <v-btn @click="showComponent = 'EtherChain'" color="green" class="ma-2">
          Add Chain
        </v-btn>
        <v-btn @click="switchChain" color="green" class="ma-2">
          Switch Chain
        </v-btn>
        <v-btn @click="sendTransaction" color="green" class="ma-2">
          Send Transaction
        </v-btn>
        <v-btn @click="requestPermission" color="green" class="ma-2">
          Request Permission
        </v-btn>
        <v-btn @click="generatePublicKey" color="green" class="ma-2">
          Generate PublicKey
        </v-btn>
        <v-btn @click="addToken" color="green" class="ma-2"> Add Token </v-btn>
      </v-col>
      <v-col class="mb-4" v-if="account" cols="12">
        <span> {{ anyString }}</span>
      </v-col>
    </v-row>
    <v-row>
      <EtherChain
        v-if="showComponent == 'EtherChain'"
        @cancle="showComponent = 'none'"
        @success="showComponent = 'none'"
        :ethereum="ethereum"
      />
    </v-row>
  </v-container>
</template>

<script>
import EtherChain from "@/components/Ether/EtherChain";
import MetaMaskOnboarding from "@metamask/onboarding";

export default {
  name: "Ether",

  components: {
    EtherChain
  },
  data: () => ({
    ethereum: null,
    accounts: null,
    account: null,
    anyString: "",
    onboarding: null,
    showComponent: ""
  }),
  computed: {
    isEther() {
      return this.ethereum ? this.ethereum.isConnected() : false;
    },
    connectNetwork() {
      return this.ethereum ? this.ethereum.networkVersion : "None";
    },
    isMetaMask() {
      return MetaMaskOnboarding.isMetaMaskInstalled();
    }
  },
  mounted() {
    this.onboarding = new MetaMaskOnboarding();
  },
  methods: {
    async installMetaMask() {
      this.onboarding.startOnboarding();
    },
    async switchChain() {
      try {
        await this.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }]
        });
        this.anyString = "switchSuccess";
        return true;
      } catch (switchError) {
        console.log("switchError", switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          return false;
        }
      }
    },
    async addEthereumChain() {
      // REF: https://chainlist.org/
      const thai = {
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7",
            chainName: "ThaiChain",
            rpcUrls: ["https://rpc.dome.cloud"]
          }
        ]
      };
      try {
        await this.ethereum.request(thai);
      } catch (addError) {
        // handle "add" error
        console.error("Fail wallet_addEthereumChain", addError);
      }
    },
    async getGasPrice() {
      const price = await this.ethereum.request({
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 73
      });
      console.log("price", price); // 10000
      const intBalance = parseInt(price) / 1000000000000000000;
      this.anyString = "가스 가격: " + intBalance;
    },
    async getBalance() {
      const balance = await this.ethereum.request({
        method: "eth_getBalance",
        params: [this.account, "latest"]
      });

      const intBalance = parseInt(balance) / 1000000000000000000;
      this.anyString = "현재 잔액: " + intBalance;
    },
    async connectEther() {
      if (typeof window.ethereum !== "undefined") {
        this.ethereum = window.ethereum;
        console.log("MetaMask is installed!", this.ethereum);
        console.log("ethereum.networkVersion", this.ethereum.networkVersion);
        console.log("ethereum.selectedAddress", this.ethereum.selectedAddress);
      } else {
        console.log("MetaMask is Not installed!");
      }
    },
    async checkAccount() {
      const accounts = await this.ethereum.request({
        method: "eth_requestAccounts"
      });
      this.accounts = accounts;
      this.account = accounts[0];
      console.log("accounts", accounts);
    },
    async sendTransaction() {
      const transactionParameters = {
        // nonce: "0x00", // ignored by MetaMask
        gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
        gas: "0x5208", // customizable by user during MetaMask confirmation.
        to: "0xB8E307A8f0EaA03d92182F855BF24435418763F7", // Required except during contract publications.
        from: this.ethereum.selectedAddress, // must match user's active address.
        value: "0x29a2241af62c0000" // Only required to send ether to the recipient from the initiating external account.
        // data:
        //   "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
        // chainId: "0x3" // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await this.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters]
      });
      console.log("txHash", txHash);
    },
    async requestPermission() {
      const { accounts } = this;
      const permissions = await this.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: accounts }]
      });
      const accountsPermission = permissions.find(
        permission => permission.parentCapability === "eth_accounts"
      );
      if (accountsPermission) {
        console.log(
          "eth_accounts permission successfully requested!",
          accountsPermission
        );
        this.anyString = "eth_accounts permission successfully requested!";
      }
    },
    async generatePublicKey() {
      const { accounts } = this;
      const encryptionPublicKey = await this.ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [accounts[0]]
      });
      if (encryptionPublicKey.error) {
        console.log("We can't encrypt anything without the key.");
      } else {
        this.anyString = "encryptionPublicKey:" + encryptionPublicKey;
        console.log("encryptionPublicKey", encryptionPublicKey);
      }
    },
    async addToken() {
      const tokenAddress = "0xd00981105e61274c8a5cd5a88fe7e037d935b513";
      const tokenSymbol = "TUT";
      const tokenDecimals = 18;
      const tokenImage = "http://placekitten.com/200/300";
      const wasAdded = await this.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage // A string url of the token logo
          }
        }
      });
      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    }
  }
};
</script>
