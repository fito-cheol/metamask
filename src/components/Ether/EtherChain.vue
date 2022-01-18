<template>
  <v-container>
    <v-row>
      <v-col md="5">
        <v-row>
          <v-text-field
            v-model="chainInfo.chainName"
            :rules="nameRules"
            :counter="10"
            label="네트워크 이름"
            required
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col md="6" offset="1">
        <v-row>
          <v-text-field
            v-model="chainInfo.rpcUrl"
            label="새 RPC URL"
            required
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-text-field
            v-model="chainInfo.chainId"
            label="체인 ID"
            required
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col cols="6" offset="1"> </v-col>

      <v-col cols="12">
        <v-btn @click="$emit('cancel')" class="mx-2"> 취소 </v-btn>
        <v-btn @click="addEthereumChain" class="mx-2"> 확인 </v-btn>
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
    method: "wallet_addEthereumChain",
    chainInfo: {
      chainId: "0x7",
      chainName: "ThaiChain",
      rpcUrl: "https://rpc.dome.cloud"
    },
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ]
  }),

  methods: {
    async addEthereumChain() {
      // REF: https://chainlist.org/
      const requestObject = {
        method: this.method,
        params: [
          {
            chainId: this.chainInfo.chainId,
            chainName: this.chainInfo.chainName,
            rpcUrls: [this.chainInfo.rpcUrl]
          }
        ]
      };
      try {
        await this.ethereum.request(requestObject);
        this.$emit("success");
      } catch (addError) {
        // handle "add" error
        console.error("Fail wallet_addEthereumChain", addError);
      }
    }
  }
};
</script>

<style></style>
