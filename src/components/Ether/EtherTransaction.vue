<template>
  <v-container>
    <v-row>
      <v-col md="5">
        <v-row>
          <v-text-field
            v-model="transactionParameters.gasPrice"
            label="gasPrice"
            required
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col md="6" offset="1">
        <v-row>
          <v-text-field
            v-model="transactionParameters.gas"
            label="gas"
            required
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-text-field
            v-model="transactionParameters.to"
            label="받는 계좌"
            required
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col cols="6" offset="1">
        <v-row>
          <v-text-field
            v-model="transactionParameters.value"
            label="금액"
            required
          ></v-text-field>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-btn @click="$emit('cancel')" class="mx-2"> 취소 </v-btn>
        <v-btn @click="sendTransaction" class="mx-2"> 확인 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    ethereum: Object
  },
  data: () => ({
    method: "eth_sendTransaction",
    transactionParameters: {
      // nonce: "0x00", // ignored by MetaMask
      gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
      gas: "0x5208", // customizable by user during MetaMask confirmation.
      to: "0xB8E307A8f0EaA03d92182F855BF24435418763F7", // Required except during contract publications.
      // from: this.ethereum.selectedAddress, // must match user's active address.
      value: "0x29a2241af62c0000" // Only required to send ether to the recipient from the initiating external account.
      // data:
      //   "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
      // chainId: "0x3" // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    },
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ]
  }),

  methods: {
    async sendTransaction() {
      const param = {
        ...this.transactionParameters,
        from: this.ethereum.selectedAddress
      };
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await this.ethereum.request({
        method: this.method,
        params: [param]
      });
      console.log("txHash", txHash);
      this.$emit("success");
    }
  }
};
</script>

<style></style>
