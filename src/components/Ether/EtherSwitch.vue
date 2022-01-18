<template>
  <v-container>
    <v-row>
      <v-col md="12">
        <v-btn
          v-for="(chain, index) in chainList"
          :key="index"
          @click="switchChain(chain.id)"
          class="mx-2"
        >
          {{ chain.name }}
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-btn @click="$emit('cancel')" class="mx-2"> 취소 </v-btn>
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
    method: "wallet_switchEthereumChain",
    // https://chainid.network/chains.json 참고
    chainList: [
      { name: "Ethereum Mainnet", id: "0x1" },
      { name: "Ropsten 테스트 네트워크", id: "0x3" },
      { name: "Rinkeby 테스트 네트워크", id: "0x4" },
      { name: "Local Ganache", id: "0x539" }
    ],
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ]
  }),

  methods: {
    async switchChain(chainId) {
      try {
        await this.ethereum.request({
          method: this.method,
          params: [{ chainId: chainId }]
        });
        this.$emit("success");
        return true;
      } catch (switchError) {
        if (switchError.code === 4902) {
          return false;
        }
      }
    }
  }
};
</script>

<style></style>
