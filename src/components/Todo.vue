<template>
  <div class="wrapper">
    <v-row>
      <input class="text_input" v-model="message" data-cy="todoInput" />
      <v-btn class="button_input" @click="addTodo" data-cy="todoInputButton" />
    </v-row>
    <v-row
      v-for="(todo, index) in localTodoList"
      :key="index"
      ref="todo"
      :data-cy="'todo' + index"
    >
      <input type="checkbox" :data-cy="'todoChechBox' + index" />
      <span :ref="'todoText' + index" :data-cy="'todoText' + index">
        {{ todo }}
      </span>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    todoList: Array
  },
  data: () => ({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x7",
        chainName: "ThaiChain",
        rpcUrls: ["https://rpc.dome.cloud"]
      }
    ]
  }),
  methods: {
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
      // const goeril = {
      //   id: 1,
      //   jsonrpc: "2.0",
      //   method: "wallet_addEthereumChain",
      //   params: [
      //     {
      //       chainId: "0x5",
      //       chainName: "Goerli",
      //       rpcUrls: ["https://goerli.infura.io/v3/INSERT_API_KEY_HERE"],
      //       nativeCurrency: {
      //         name: "Goerli ETH",
      //         symbol: "gorETH",
      //         decimals: 18
      //       },
      //       blockExplorerUrls: ["https://goerli.etherscan.io"]
      //     }
      //   ]
      // };
      // const ganache = {
      //   id: 1,
      //   jsonrpc: "2.0",
      //   method: "wallet_addEthereumChain",
      //   params: [
      //     {
      //       chainId: "0x539",
      //       chainName: "GanacheHttps",
      //       nativeCurrency: {
      //         name: "Goerli ETH",
      //         symbol: "gorETH", // 2-6 characters long
      //         decimals: 18
      //       },
      //       iconUrls: [
      //         "https://xdaichain.com/fake/example/url/xdai.svg",
      //         "https://xdaichain.com/fake/example/url/xdai.png"
      //       ],
      //       rpcUrls: ["https://127.0.0.1:8545", "http://127.0.0.1:8546"]
      //     }
      //   ]
      // };
      try {
        await this.ethereum.request(thai);
      } catch (addError) {
        // handle "add" error
        console.error("Fail wallet_addEthereumChain", addError);
      }
    }
  }
};
</script>

<style></style>
