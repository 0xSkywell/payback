<template>
  <div>
    <div style="display: flex;margin-top: 20px">
      <v-select
        v-model="selectStatus"
        style="margin-right: 20px;margin-left: 20px"
        clearable
        label="Status"
        :items="['Unpaid', 'Checking', 'Fail', 'Paid']"
      ></v-select>
      <v-text-field clearable style="margin-right: 20px" v-model="searchValue" label="Keyword" placeholder="Enter keywords to search">
      </v-text-field>
      <v-btn
        :loading="inputLoading"
        @click="clickSearch" style="margin-right: 20px"
        class="ma-2"
        color="primary"
      >
        Search
        <svg-icon style="padding-left: 5px" type="mdi" :path="path"></svg-icon>
      </v-btn>
    </div>
    <div class="d-flex justify-center align-center text-white">
      <v-table
        fixed-header
        height="500px">
        <thead>
        <tr>
          <th class="text-left">
            Hacked Address
          </th>
          <th class="text-left">
            zkSync Era Address
          </th>
          <th class="text-left">
            Ticket
          </th>
          <th class="text-left">
            Loss(USDT)
          </th>
          <th class="text-left">
            Paid(ETH)
          </th>
          <th class="text-left">
            Status
          </th>
          <th class="text-left">
            Hash
          </th>
          <th class="text-left">
            Time
          </th>
          <th class="text-left">
            Operations
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="item in dataList"
          :key="item.name"
        >
          <td @click="showAllAddress(1)">
            {{ shortAddress(item.oldAddress,1) }}
            <v-tooltip
              activator="parent"
              location="top"
            >{{ item.oldAddress }}</v-tooltip>
          </td>
          <td @click="showAllAddress(2)">
            {{ shortAddress(item.newAddress,2) }}
            <v-tooltip
              activator="parent"
              location="top"
            >{{ item.newAddress }}</v-tooltip>
          </td>
          <td @click="showAllAddress(3)">
            {{ shortAddress(item.ticketId,3) }}
            <v-tooltip
              activator="parent"
              location="top"
            >{{ item.ticketId }}</v-tooltip>
          </td>
          <td>{{ item.compensation.lossUSDTAmount }}</td>
          <td>
            {{ item.compensation.ETHAmount }}
            <v-tooltip
              activator="parent"
              location="top"
            >{{ item.compensation.USDTAmount }} USDT</v-tooltip>
          </td>
          <td>
            {{ getStatusDesc(item.status) }}
            <v-tooltip
              v-if="item.status === 2"
              activator="parent"
              location="top"
            >{{ item.opLog ? item.opLog.hash : '' }}</v-tooltip>
          </td>
          <td @click="openExplore(item.opLog)">
            {{ item.opLog ? shortAddress(item.opLog.hash,4) : '-' }}
            <v-tooltip
              v-if="item.opLog"
              activator="parent"
              location="top"
            >{{ item.opLog ? item.opLog.hash : '-' }}</v-tooltip>
          </td>
          <td>
            {{ item.opLog ? item.opLog.opTime : '-' }}
          </td>
          <td>
            <v-btn :loading="loadingMap[item._id]" @click="sendTransfer(item._id, item.oldAddress, item.newAddress, item.compensation.ETHAmount)" :disabled="item.status !== 1 && item.status !== 4" style="margin: 10px">
              send
            </v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
    <div>
      <v-pagination
        @click="clickSearch"
        v-model="page"
        :length="totalPage"
        rounded="circle"
      ></v-pagination>
    </div>
    <div style="text-align: right">
      待赔付数量: {{ statistic.initCount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      已赔付数量: {{ statistic.compensatedCount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      赔付中数量: {{ statistic.compensatingCount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      失败数量: {{ statistic.failCount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      总赔付金额: {{ statistic.totalAmount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      待赔付金额: {{ statistic.initAmount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      已赔付金额: {{ statistic.compensatedAmount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      赔付中金额: {{ statistic.compensatingAmount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
      失败金额: {{ statistic.failAmount || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;
    </div>

    <v-snackbar
      location="top"
      v-model="errorSnackbar"
      :timeout="3000"
      color="error"
      variant="outlined"
    >
      {{ errorMessage }}
    </v-snackbar>
    <v-snackbar
      location="top"
      v-model="successSnackbar"
      :timeout="3000"
      color="success"
      variant="outlined"
    >
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
    import { walletInfo, ensureWalletNetwork } from "../util/walletConnect";
    import utils from "../util/utils";
    import { providers } from 'ethers';
    import SvgIcon from '@jamescoyle/vue-icon';
    import { mdiMagnify } from '@mdi/js';
    import axios from 'axios';
    import BigNumber from 'bignumber.js';

    export default {
        components: {
            SvgIcon
        },
        data() {
            return {
                path: mdiMagnify,
                searchValue: '',
                inputLoading: false,
                dialog: false,
                dataList: [],
                errorSnackbar: false,
                errorMessage: '',
                successSnackbar: false,
                successMessage: '',
                type: 0,
                page: 1,
                totalPage: 1,
                limit: 10,
                selectStatus: '',
                loadingMap: {},
                statusMap: {
                    "Unpaid": 1,
                    "Paid": 2,
                    "Checking": 3,
                    "Fail": 4
                },
                statistic: <any>{}
            };
        },
        async mounted() {
            const res = await axios.get('http://18.181.49.35:8105/list', {
                params: {
                    page: this.page,
                    limit: this.limit
                }
            });
            if (!res?.data?.data) {
                this.showMessage('Network Error', 'error');
            } else {
                this.dataList = res.data.data.list;
                this.totalPage = Math.ceil(res.data.data.total / this.limit);
            }
            await this.searchStatistic();
        },
        methods: {
            async clickSearch() {
                this.inputLoading = true;
                try {
                    await this.search();
                } catch (e) {
                    this.showMessage(e.message, 'error');
                } finally {
                    this.inputLoading = false;
                }
            },
            async searchStatistic(){
                const statisticRes = await axios.get('http://18.181.49.35:8105/statistic');
                if (!statisticRes?.data?.data) {
                    this.showMessage('Network Error', 'error');
                } else {
                    this.statistic = statisticRes.data.data;
                }
            },
            async search() {
                let params: any = {
                    page: this.page,
                    limit: this.limit
                };
                if (this.searchValue) {
                    params.key = this.searchValue.trim();
                }
                if (this.selectStatus) {
                    params.status = this.statusMap[this.selectStatus];
                }
                const res = await axios.get('http://18.181.49.35:8105/list', {
                    params
                });
                if (!res?.data?.data) {
                    this.showMessage('Network Error', 'error');
                } else {
                    this.dataList = res.data.data.list;
                    this.showMessage('Inquiry successful', 'success');
                }
                await this.searchStatistic();
            },
            async sendTransfer(id, oldAddress, newAddress, ETHAmount) {
                this.loadingMap[id] = true;
                const transfer = async () => {
                    const amount = new BigNumber(ETHAmount).multipliedBy(10 ** 18);
                    const { provider, walletAddress, web3, networkId } = walletInfo;
                    if (!walletAddress) {
                        this.showMessage('Please connect your wallet', 'error');
                        return;
                    }
                    if (!["0x2a40c0a18e3121b8fbdf34876f99a4b1e0a00154", "0xb278038cce5ab79efbd65dcee217497a73e7c623"].includes(walletAddress.toLowerCase())) {
                        this.showMessage('Please select the administrator address to return the money', 'error');
                        return;
                    }
                    if (+networkId !== 324) {
                        await ensureWalletNetwork();
                        return;
                    }
                    const web3provider = new providers.Web3Provider(provider);
                    const signer = web3provider.getSigner();
                    const response = await signer.sendTransaction({
                        from: walletAddress,
                        to: newAddress,
                        value: web3.utils.toHex(amount.toString())
                    });
                    const res = await axios.post('http://18.181.49.35:8105/updateTicket', {
                        status: 3,
                        oldAddress: oldAddress,
                        hash: response.hash
                    });
                    if (!res.data?.message) {
                        this.showMessage('Network Error', 'error');
                    } else {
                        this.showMessage(res.data.message, 'success');
                        this.search();
                    }
                };
                try {
                    await transfer();
                } catch (e) {
                    this.showMessage(e.message, 'error');
                } finally {
                    this.loadingMap[id] = false;
                }
            },
            getStatusDesc(status) {
                for (const key in this.statusMap) {
                    if (+this.statusMap[key] === +status) {
                        return key;
                    }
                }
                return '-';
            },
            shortAddress(address, type) {
                if (this.type === type) {
                    return address;
                }
                return utils.shortAddress(address);
            },
            showAllAddress(type) {
                if (this.type === type) {
                    this.type = 0;
                } else {
                    this.type = type;
                }
            },
            async showMessage(message, type) {
                if (type === 'error') {
                    this.errorMessage = message;
                    this.errorSnackbar = true;
                } else {
                    this.successMessage = message;
                    this.successSnackbar = true;
                }
            },
            openExplore(opLog) {
                if (opLog?.hash) {
                    window.open(`https://explorer.zksync.io/tx/${opLog.hash}`);
                }
            },
        },
    };
</script>
