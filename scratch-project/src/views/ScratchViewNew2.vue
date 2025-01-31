<template>
    <div class="scratchView">
      <br/>
      <div class="scratchViewRow">
        <div :style="{width: '2vw', height: '2px'}"></div>
        <div class="scratchViewAllPrize">
          <br/>
          <h2 class="showScratchRadiusValue">目前獎項</h2>
          <table class="tableGridDiv">
            <thead>
              <tr>
                <th>中獎項目</th>
                <th>獎品數量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in prizeNowCountArray" :key="index">
                <td>{{ item.item }}</td>
                <td>{{ item.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="scratchViewBody">
          <div class="scratch-object">
            <img class="backgroundImg" :src="ImagePath.backGroundImage_rekarita_2"/>
            <div class="showScratchDiv">
              <ScratchComponents 
                ref="scratchCard" 
                :scratchPercent="70" 
                :maskColor="'skyblue'" 
                :fillStyle="'red'" 
                :font="'30px Arial'" 
                :text="'刮一刮文字'" 
                :imageUrl="imageUrl" 
                :radius="5" 
                :scratchRadius="scratchRadius*sliderValue/100"    
                @scratchStart="scratchStart" @scratchEnd="scratchEnd" @scratchAll="scratchAll" 
                @touchStart="touchStart" @touchEnd="touchEnd">
                  <div class="prize">
                    <div class="prizeShowDiv">
                      <label class="prizeString">{{ prize }}</label>
                    </div>
                  </div>
              </ScratchComponents>
            </div>
          </div>
          <br/><br/><br/>
          <div class="scratch-setting">
            <div class="btn-reset" :style="{backgroundColor: '#50afe4'}" @click="openSetting">{{ isSettingOpen ? '收回獎項設定' : '打開獎項設定' }}</div>
            <br/>
            <transition name="slider">
              <div v-show="isSettingOpen" class="showAllSetting">
                <div class="scratchRadiusValue">
                  <h2 class="showScratchRadiusValue">刮刮樂刮除半徑 {{ sliderValue }}%</h2>
                  <VueSlider v-model="sliderValue" v-bind="{min:10, max:100, dotSize:14, width: '50%', height: 4}"></VueSlider>
                </div>
                <br/>
                <div class="showSetting">
                  <div class="setting-field-div">
                    <div class="btn-reset" :style="{backgroundColor: '#75bee9', width: '15vw', height: '20px'}" @click="prizeAdd">獎項修改</div>
                    <br/>
                    <textarea class="setting-field" type="text" v-model="settingValue"></textarea>
                  </div>
                  <div class="setting-field-count-div">
                    <div class="btn-reset" :style="{backgroundColor: '#75bee9', width: '15vw', height: '20px'}" @click="prizeCountUpdate">獎項數量修改</div>
                    <br/>
                    <table class="tableGridDiv">
                      <thead>
                        <tr>
                          <th>中獎項目</th>
                          <th>獎品數量</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in prizeSettingCountArray" :key="index">
                          <td>{{ item.item }}</td>
                          <td>
                            <input type="number" min="1" v-model="item.count" class="prizeCountInput" @blur="checkInput(index)"/>
                          </td>
                          <!-- <td>{{ item.count }}</td> -->
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <br/>
          <div class="scratch-action">
            <br/>
            <div class="btn-reset" :style="{backgroundColor: (prizeArray.length == 0) ? '#f2f2f2' : '#e1bee7'}" @click="reset">開始刮刮 / 重新刮刮</div>
            <!-- <br/>
            <div class="btn-reset" :style="{backgroundColor: isScratchComplete ? '#d1c4e9' : '#f2f2f2'}" @click="removePrice">移除此獎項</div> -->
            <br/>
            <div class="btn-reset" :style="{backgroundColor: '#b39ddb'}" @click="resetPrice">重置設定的獎項</div>
            <br/>
            <div class="btn-reset" :style="{backgroundColor: '#e1bee7'}" @click="removeRecord">清除中獎紀錄</div>
            <br/>
          </div>
        </div>
        <div class="scratchViewResult">
          <br/>
          <div class="tableDiv">
            <div class="tableTitle">本次中獎</div>
            <div class="tableData">{{ isScratchComplete ? prize : '' }}</div>
          </div>
          <br/>
          <div class="tableDiv">
            <div class="tableTitle">中獎紀錄</div>
            <div v-show="prizeRecordArray.length == 0" class="tableData"></div>
            <div v-for="(item, index) in prizeRecordArray" class="tableData" :key="index">{{ item }}</div>
          </div>
        </div>
        <div :style="{width: '2vw', height: '2px'}"></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeMount, onMounted } from 'vue';
  import ScratchComponents from '@/components/ScratchComponents.vue';
  import ScratchSettingComponents from '@/components/ScratchSettingComponents.vue';
  import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
  import {ImagePath} from '../resources/web_image';
  import { SidebarMenu } from 'vue-sidebar-menu';
  import VueSlider from 'vue-slider-component';
  import 'vue-slider-component/theme/default.css';
  
  const imageUrl = ref(ImagePath.backGroundImage_rekarita_1);
  
  const scratchRadius = window.innerWidth * 0.8 / 8;
  
  const prizeSettingArray = ref(['1', '2', '3', '4', '5']);
  
  const prizeArray = ref(['1', '2', '3', '4', '5']);
  
  const prizeSettingCountArray = ref([
    {
      'item': '1',
      'count' : 1
    },
    {
      'item': '2',
      'count' : 1
    },
    {
      'item': '3',
      'count' : 1
    },
    {
      'item': '4',
      'count' : 1
    },
    {
      'item': '5',
      'count' : 1
    },
  ]);
  
  const prizeNowCountArray = ref([
    {
      'item': '1',
      'count' : 1
    },
    {
      'item': '2',
      'count' : 1
    },
    {
      'item': '3',
      'count' : 1
    },
    {
      'item': '4',
      'count' : 1
    },
    {
      'item': '5',
      'count' : 1
    },
  ]);
  
  const nowCurrent = ref(-1);
  
  const prizeRecordArray = ref([]);
  
  const prize = ref('');
  const scratchCard = ref();
  const isScratchComplete = ref(false);
  const isSideBarOFF = ref(false);
  const isSettingOpen = ref(true);
  const settingValue = ref('1\n2\n3\n4\n5');
  
  const sliderValue = ref(30);
  
  const menu = ref([
    {
        header: 'Main Navigation',
        hiddenOnCollapse: true,
    },
    {
        component: ScratchSettingComponents,
        hiddenOnCollapse: true,
    }
  ]);
  
  function onToggleCollapse() {
    isSideBarOFF.value = !isSideBarOFF.value
    console.log('JN - onToggleCollapse....', isSideBarOFF.value ? "關閉" : "打開");
    
  }
  
  function scratchStart() {
    console.log("JN - scratch start");
  }
  
  function scratchEnd() {
    console.log('JN - scratch end');
  }
  
  function scratchAll() {
    console.log('JN - scratch all');
    isScratchComplete.value = true;
    if (prize.value != '') {
        prizeRecordArray.value.push(prize.value);
        prizeArray.value.splice(nowCurrent.value, 1);
        const foundItem = prizeNowCountArray.value.find(obj => obj.item === prize.value);
        if (foundItem) {
          foundItem.count--;
        }
        console.log('JN - now prizeNowCountArray:', prizeNowCountArray.value);
    }
  }

  function touchStart() {
    document.body.style.overflow = "hidden";
  }

  function touchEnd() {
    document.body.style.overflow = "";
  }
  
  function reset() {
    console.log('JN - scratch reset');
    if (prizeArray.value.length <= 0) {
      alert("獎項已抽完，若要重新抽獎請按\"重置設定的獎項\"");
      return;
    }
    isScratchComplete.value = false;
    nowCurrent.value = getRandomInt(0, prizeArray.value.length - 1);
    prize.value = prizeArray.value[nowCurrent.value];
    console.log(`JN - 隨機選項:${nowCurrent.value + 1} - ${prize.value}`);
    scratchCard.value?.reset();
  }
  
  function removePrice() {
    console.log('JN - remove price');
    if (isScratchComplete.value) {
        if (prizeArray.value.length > 1) {
            prizeArray.value.splice(nowCurrent.value, 1);
            reset();
        }
    }
  }
  
  function resetPrice() {
    console.log('JN - reset price');
    prizeArray.value = structuredClone(prizeSettingArray.value);
    prizeNowCountArray.value = structuredClone(prizeSettingCountArray.value);
    reset();
    removeRecord();
  }
  
  function removeRecord() {
    prizeRecordArray.value = [];
  }
  
  function prizeAdd() {
    const resArray = settingValue.value.split('\n').filter(item => item != "");
    prizeSettingArray.value = structuredClone(resArray);
    let resCountArray = [];
    prizeSettingArray.value.map((value) => resCountArray.push({"item": value, "count": 1}));
    prizeSettingCountArray.value = structuredClone(resCountArray);
    prizeNowCountArray.value = structuredClone(resCountArray);
    prizeArray.value = structuredClone(resArray);
    reset();
  }
  
  function prizeCountUpdate() {
    console.log('JN - now prizeSettingCountArray:', prizeSettingCountArray.value);
    prizeNowCountArray.value = structuredClone(prizeSettingCountArray.value);
    console.log('JN - now prizeNowCountArray:', prizeNowCountArray.value);
    let resArray = [];
    for (let e in prizeNowCountArray.value) {
      console.log('JN - now prizeNowCountArray e:', prizeNowCountArray.value[e]);
      for (var i = 0; i < prizeNowCountArray.value[e].count; i++) {
        resArray.push(prizeNowCountArray.value[e].item);
      }
    }
    prizeSettingArray.value = structuredClone(resArray);
    prizeArray.value = structuredClone(resArray);
    console.log('JN - resArray:', resArray);
    reset();
  }

  function checkInput(index) {
    console.log('JN - check Input value:', prizeSettingCountArray.value[index].count);
    let value = prizeSettingCountArray.value[index].count;
    if (typeof value != "number" || isNaN(value)) {
        prizeSettingCountArray.value[index].count = 1
    } else if (value <= 0) {
        prizeSettingCountArray.value[index].count = 1
    }
  }
  
  function openSetting() {
    isSettingOpen.value = !isSettingOpen.value;
  }
  
  function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  onBeforeMount(() => {
    document.title = "電子刮刮樂";
    reset();
  });
  
  </script>
  
  <style scoped>
  
  .scratchView {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #1ED760;
    min-height: 100vh;
    padding: 10px;
  }
  
  .scratchViewRow {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  
  .scratchViewAllPrize {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 23vw;
    padding: 10px;
  }
  
  .scratchViewBody {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50vw;
  }
  
  .scratchViewResult {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 23vw;
  }
  
  .backgroundImg {
    width: 50vw;
    max-width: 1000px;
    height: auto;
    object-fit: contain;
    z-index: 1;
  }
  
  .scratch-object {
    position: relative;
    user-select: none;
    width: 50vw;
    max-width: 1000px;
    height: auto;
  }
  
  .showScratchDiv {
    position: absolute;
    top: min(268.14px, 13.407vw);
    left: min(332.2px, 16.6vw);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .prize {
    width: 16.6vw;
    max-width: 332px;
    height: 9.485vw;
    max-height: 189.7px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .prizeImg {
    position: absolute;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  
  .prizeShowDiv {
    position: absolute;
    width: 16.6vw;
    max-width: 332px;
    height: 9.485vw;
    max-height: 189.7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .prizeString {
    position: absolute;
    font-size: large;
    font-family: Arial, Helvetica, sans-serif;
    color: black;
    font-weight: bold;
  }
  
  .scratch-setting {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .showAllSetting {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: auto;
  }
  
  .scratchRadiusValue {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
  }
  
  .showScratchRadiusValue {
    font-weight: 400;
    text-align: center;
    line-height: 1.6;
    font-family: "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "WenQuanYi Micro Hei", "PMingLiU", sans-serif;
  }
  
  .showSetting {
    display: flex;
    flex-direction: row;
    gap: 5%;
    width: 100%;
    height: auto;
    justify-content: center;
  }
  
  .slide-enter-active,
  .slide-leave-active {
  transition: max-height 0.3s ease, padding 0.3s ease;
  }
  
  .slide-enter-from,
  .slide-leave-to {
  max-height: 0;
  padding: 0 20px;
  opacity: 0;
  }
  
  .setting-field-div {
    width: 20vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
  
  .setting-field-count-div {
    width: 20vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
  
  .setting-field {
    width: 90%;
    height: auto;
    resize: vertical;
    font-size: medium;
    min-height: 20vw;
    font-weight: 400;
    text-align: center;
    line-height: 1.6;
    font-family: "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "WenQuanYi Micro Hei", "PMingLiU", sans-serif;
  }
  
  .scratch-action {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 99;
  }
  
  .btn-reset {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: 50px;
    border: 2px solid silver;
    border-radius: 15px;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: large;
    color: white;
    font-weight: bold;
    font-family: "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "WenQuanYi Micro Hei", "PMingLiU", sans-serif;
  }
  
  .tableDiv {
    width: 20vw;
    height: auto;
    border: 2px solid silver;
    border-radius: 10px;
    background-color: white;
    overflow: hidden;
    font-family: "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "WenQuanYi Micro Hei", "PMingLiU", sans-serif;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .tableTitle {
    background-color: #9575cd;
    color: white;
    padding: 10px;
    font-size: large;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid silver;
  }
  
  .tableData {
    color: #333;
    padding: 15px;
    font-size: medium;
    line-height: 1.6;
  }
  
  .tableGridDiv {
    width: 100%;
    height: auto;
    border: 2px solid silver;
    border-radius: 10px;
    background-color: white;
    overflow: hidden;
    font-family: "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "WenQuanYi Micro Hei", "PMingLiU", sans-serif;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .tableGridDiv thead {
    background-color: #9575cd;
    color: white;
    padding: 10px;
    border-bottom: 1px solid silver;
  }
  
  .tableGridDiv th {
    font-size: large;
    font-weight: bold;
    text-align: center;
  }
  
  .tableGridDiv tbody {
    padding: 15px;
  }
  
  .tableGridDiv td {
    color: #333;
    font-size: medium;
    line-height: 1.6;
  }
  
  .prizeCountInput {
    width: 40%;
    text-align: center;
    padding: 5px;
    font-size: medium;
  }
  
  </style>