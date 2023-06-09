<template>
  <v-app id="inspire">
    <v-app-bar
      class="px-3"
      color="white"
      flat
      density="compact"
    >
<!--      <v-avatar-->
<!--        color="grey-darken-1"-->
<!--        size="32"-->
<!--      ></v-avatar>-->

      <v-spacer></v-spacer>

      <v-tabs
        v-model="currentTab"
        centered
        color="grey-darken-2"
      >
        <v-tab
          v-for="link in links"
          :key="link"
          @click="switchTab"
        >
          {{ link }}
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>

      <v-btn
        :loading="connectBtnLoading"
        class="btn"
        variant="tonal"
        @click="dialogShow = true"
      >
        {{ shortAddress || 'Connect Wallet' }}
      </v-btn>

      <v-dialog
        v-model="dialogShow"
        width="auto"
        style="display: flex;flex-direction: column"
      >
        <v-btn v-if="shortAddress" @click="disconnect">
          disconnect wallet
        </v-btn>
        <v-btn v-else @click="connect(item.value)" v-for="item in walletList" class="btn" style="margin-top: 30px">
          <v-img
            style="margin-right: 8px"
            :width="20"
            :src="`src/assets/${item.icon}.svg`"
          ></v-img>
          {{ item.title }}
        </v-btn>
      </v-dialog>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-app>
          <router-view />
        </v-app>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
    import { connectWallet, supportWalletList, disconnectWallet } from "../util/walletConnect";
    import utils from "../util/utils";
    export default {
        components: {
        },
        data: () => ({
            connectBtnLoading: false,
            dialogShow: false,
            currentTab: 0,
            links: [
                // 'Home',
                // 'Dashboard'
            ],
            walletList: [],
            shortAddress: ''
        }),
        async mounted() {
            this.walletList = (await supportWalletList()).map(item => {
                return { title: item, value: item, icon: item.toLowerCase() };
            });
        },
        methods:{
            async connect(v) {
                this.connectBtnLoading = true;
                const { wallet, msg } = await connectWallet(v);
                console.log(msg);
                this.shortAddress = utils.shortAddress(wallet.walletAddress);
                this.dialogShow = false;
                this.connectBtnLoading = false;
            },
            disconnect() {
                const walletInfo = disconnectWallet();
                this.shortAddress = utils.shortAddress(walletInfo.walletAddress);
                this.dialogShow = false;
            },
            switchTab() {
                if (this.currentTab === 0) {
                    this.$router.push({ path: '/' });
                } else if (this.currentTab === 1) {
                    this.$router.push({ path: '/Dashboard' });
                }
            }
        }
    }
</script>
