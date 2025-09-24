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
            <img class="backgroundImg" :src="scratchConfig.setting.backgroundImage"/>
            <div class="showScratchDiv">
              <ScratchComponents 
                ref="scratchCard" 
                :scratchPercent="70" 
                :maskColor="'skyblue'" 
                :fillStyle="'red'" 
                :font="'30px Arial'" 
                :text="'刮一刮文字'" 
                :imageUrl="scratchConfig.setting.maskImage" 
                :radius="5" 
                :scratchRadius="scratchRadius*sliderValue/100"    
                @scratchStart="scratchStart" @scratchEnd="scratchEnd" @scratchAll="scratchAll" 
                @touchStart="touchStart" @touchEnd="touchEnd">
                  <div class="prize">
                    <div class="prizeShowDiv">
                      <label class="prizeString" :style="{color: scratchConfig.setting.prizeFontColor, fontSize: scratchConfig.setting.prizeFontSize + 'px'}">{{ prize }}</label>
                    </div>
                  </div>
              </ScratchComponents>
            </div>
          </div>
          <br/><br/><br/>
          <!-- 刮刮樂按鈕 -->
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
          <br/>
          <!-- 刮刮樂設定 -->
          <div class="scratch-setting">
            <!-- 刮刮樂獎項設定 -->
            <div class="btn-reset" :style="{backgroundColor: '#50afe4'}" @click="openSetting(true)">{{ isSettingOpen ? '收回獎項設定' : '打開獎項設定' }}</div>
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
                          <th>抽獎比重</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in prizeSettingCountArray" :key="index">
                          <td>{{ item.item }}</td>
                          <td>
                            <input type="number" min="1" v-model="item.count" class="prizeCountInput" @blur="checkInput(index)"/>
                          </td>
                          <td>
                            <input type="number" min="1" v-model="item.weight" class="prizeCountInput" @blur="checkInput(index)"/>
                          </td>
                          <!-- <td>{{ item.count }}</td> -->
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </transition>
            <br/>
            <!-- 刮刮樂本體設定 -->
            <div class="btn-reset" :style="{backgroundColor: '#7FCBF0'}" @click="openSetting(false)">{{ isScratchSettingOpen ? '收回刮刮樂本體設定' : '打開刮刮樂本體設定' }}</div>
            <br/>
            <transition name="slider">
              <div v-show="isScratchSettingOpen" class="showAllSetting">
                <div>
                  <h2 class="showScratchRadiusValue">刮刮樂預覽</h2>
                  <div class="image-overlay">
                    <img class="bg-img" :src=scratchSettingValue.backgroundImage />
                    <div class="top-img-wrapper">
                      <img class="top-img" :src=scratchSettingValue.maskImage :style="{opacity: isScratchSettingTopImgShow ? 1 : 0, width: (scratchSettingValue.scratchRatio / 100 * 20.5) + 'vw', maxWidth: (scratchSettingValue.scratchRatio / 100 * 410) + 'px'}"/>
                      <label class="middle-label" :style="{color: scratchSettingValue.prizeFontColor, fontWeight: 'bold', fontSize: scratchSettingValue.prizeFontSize + 'px'}">獎品測試文字</label>
                    </div>
                  </div>
                  <br/>
                  <h2 class="showScratchRadiusValue">
                    <input type="checkbox" v-model="isScratchSettingTopImgShow" />
                    顯示刮刮樂圖片
                  </h2>
                  <div class="scratchRadiusValue">
                    <h2 class="showScratchRadiusValue">背景圖片</h2>
                    <UploadImageToBase64Components ref="bgImgUpload" :isBackgroundImage='true' @imageOutput="getImageBase64"></UploadImageToBase64Components>
                  </div>
                  <br/>
                  <div class="scratchRadiusValue">
                    <h2 class="showScratchRadiusValue">刮刮樂區圖片</h2>
                    <UploadImageToBase64Components ref="maskImgUpload" :isBackgroundImage='false' @imageOutput="getImageBase64"></UploadImageToBase64Components>
                  </div>
                  <br/>
                  <!-- <div class="scratchRadiusValue">
                    <h2 class="showScratchRadiusValue">刮刮樂區域：{{ scratchSettingValue.scratchRatio }}</h2>
                    <VueSlider v-model="scratchSettingValue.scratchRatio" v-bind="{min:100, max:150, dotSize:14, width: '50%', height: 4}"></VueSlider>
                  </div>
                  <br/> -->
                  <div class="scratchRadiusValue">
                    <h2 class="showScratchRadiusValue">刮刮樂文字大小: {{ scratchSettingValue.prizeFontSize }}</h2>
                    <VueSlider v-model="scratchSettingValue.prizeFontSize" v-bind="{min:20, max:40, dotSize:14, width: '50%', height: 4}"></VueSlider>
                    <h2 class="showScratchRadiusValue">刮刮樂文字顏色</h2>
                    <ChromePicker v-model="scratchSettingValue.prizeFontColor" />
                    <h2 class="showScratchRadiusValue" :style="{color: scratchSettingValue.prizeFontColor, fontWeight: 'bold', fontSize: scratchSettingValue.prizeFontSize + 'px'}">獎品測試文字</h2>
                  </div>
                  <br/>
                </div>
                <br/>
                <!-- 設定儲存按鈕 -->
                <div class="btn-group">
                  <button class="btn purple" @click="resetScratchSetting">重設</button>
                  <button class="btn blue" @click="applyScratchSetting">套用設定</button>
                </div>
              </div>
            </transition>
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
  import UploadImageToBase64Components from '@/components/UploadImageToBase64Components.vue';
  import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
  import {ImagePath} from '../resources/web_image';
  import { SidebarMenu } from 'vue-sidebar-menu';
  import { useScratchConfig } from '@/stores/scratchConfig';
  import { ScratchSetting } from '@/models/ScratchSetting';
  import VueSlider from 'vue-slider-component';
  import { ChromePicker } from 'vue-color'
  import 'vue-slider-component/theme/default.css';
  
  const imageUrl = ref(ImagePath.backGroundImage_letizia_2);
  
  const scratchRadius = window.innerWidth * 0.8 / 8;
  
  const prizeSettingArray = ref(['1', '2', '3', '4', '5']);
  
  const prizeArray = ref(['1', '2', '3', '4', '5']);
  
  const prizeSettingCountArray = ref([
    {
      'item': '1',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '2',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '3',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '4',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '5',
      'count' : 1,
      'weight' : 1
    },
  ]);
  
  const prizeNowCountArray = ref([
    {
      'item': '1',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '2',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '3',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '4',
      'count' : 1,
      'weight' : 1
    },
    {
      'item': '5',
      'count' : 1,
      'weight' : 1
    },
  ]);
  
  const nowCurrent = ref(-1);
  
  const prizeRecordArray = ref([]);
  
  const prize = ref('');
  const scratchCard = ref();
  const isScratchComplete = ref(false);
  const isSideBarOFF = ref(false);
  const isSettingOpen = ref(true);
  const isScratchSettingOpen = ref(true);
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

  // 刮刮樂設定值注入
  const scratchConfig = useScratchConfig();
  const scratchSettingValue = ref<ScratchSetting>({
        backgroundImage: scratchConfig.setting.backgroundImage,
        maskImage: scratchConfig.setting.maskImage,
        scratchRatio: scratchConfig.setting.scratchRatio,
        prizeFontSize: scratchConfig.setting.prizeFontSize,
        prizeFontColor: scratchConfig.setting.prizeFontColor
    })

  const isScratchSettingTopImgShow = ref(true);

  const bgImgUpload = ref<InstanceType<typeof UploadImageToBase64Components> | null>(null)
  const maskImgUpload = ref<InstanceType<typeof UploadImageToBase64Components> | null>(null)
  
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
        // prizeRecordArray.value.push(prize.value);
        // prizeArray.value.splice(nowCurrent.value, 1);
        // const foundItem = prizeNowCountArray.value.find(obj => obj.item === prize.value);
        // if (foundItem) {
        //   foundItem.count--;
        // }

        // 重新貼上紀錄與減少count
        prizeRecordArray.value.push(prize.value);
        prizeNowCountArray.value[nowCurrent.value]["count"] = prizeNowCountArray.value[nowCurrent.value]["count"] - 1;
        console.log('JN - now prizeNowCountArray:', prizeNowCountArray.value);
    }
  }

  function touchStart() {
    document.body.style.overflow = "hidden";
  }

  function touchEnd() {
    document.body.style.overflow = "";
  }

  function applyScratchSetting() {
    console.log("JN - applyScratchSetting");
    scratchConfig.setting.backgroundImage = scratchSettingValue.value.backgroundImage;
    scratchConfig.setting.maskImage = scratchSettingValue.value.maskImage;
    scratchConfig.setting.scratchRatio = scratchSettingValue.value.scratchRatio;
    scratchConfig.setting.prizeFontSize = scratchSettingValue.value.prizeFontSize;
    scratchConfig.setting.prizeFontColor = scratchSettingValue.value.prizeFontColor;
    resetPrice();
    alert("已完成修改");
  }

  function resetScratchSetting() {
    console.log("JN - resetScratchSetting");
    scratchSettingValue.value.backgroundImage = scratchConfig.setting.backgroundImage;
    scratchSettingValue.value.maskImage = scratchConfig.setting.maskImage;
    scratchSettingValue.value.scratchRatio = scratchConfig.setting.scratchRatio;
    scratchSettingValue.value.prizeFontSize = scratchConfig.setting.prizeFontSize;
    scratchSettingValue.value.prizeFontColor = scratchConfig.setting.prizeFontColor;
    bgImgUpload.value?.clear();
    maskImgUpload.value?.clear();
    alert("已清除設定");
  }

  function getImageBase64({ isBackgroundImage, base64 }: { isBackgroundImage: boolean; base64: string }) {
    if (isBackgroundImage) {
      console.log("JN - background image: ", base64);
      scratchSettingValue.value.backgroundImage = base64;
    } else {
      console.log("JN - mask image: ", base64);
      scratchSettingValue.value.maskImage = base64;
    }
  }
  
  function reset() {
    console.log('JN - scratch reset');

    // 機率重算
    let total = 0;
    const weights = prizeNowCountArray.value.map((row) => {
      const w = Math.max(0, row["count"]) * Math.max(0, row["weight"]);
      total += w;
      console.log("JN - row的比重w: ", w);
      return w;
    });

    if (total <= 0) {
      alert("獎項已抽完，若要重新抽獎請按\"重置設定的獎項\"");
      return;
    }
    // if (prizeArray.value.length <= 0) {
    //   alert("獎項已抽完，若要重新抽獎請按\"重置設定的獎項\"");
    //   return;
    // }
    isScratchComplete.value = false;

    // 機率重算
    console.log("JN - 總數量total: ", total);
    let r = Math.random() * total;
    console.log("JN - 亂數r: ", r);
    console.log("JN - 全部獎品: ", prizeNowCountArray);
    for (let i = 0; i < prizeNowCountArray.value.length; i++) {
      const w = weights[i];
      if (w <= 0 ) continue
      if (r < w) {
        console.log("JN - 獎品與數量:", prizeNowCountArray.value[i]["item"], prizeNowCountArray.value[i]["count"])
        nowCurrent.value = i;
        prize.value = prizeNowCountArray.value[i]["item"];
        break;
      } else {
        r -= w;
      }
      console.log("JN - 處理後的亂數r: ", r);
    }

    // nowCurrent.value = getRandomInt(0, prizeArray.value.length - 1);
    // prize.value = prizeArray.value[nowCurrent.value];

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
    prizeSettingArray.value.map((value) => resCountArray.push({"item": value, "count": 1, "weight": 1}));
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
  
  function openSetting(isItemSetting: boolean) {
    if (isItemSetting) {
      isSettingOpen.value = !isSettingOpen.value;
    } else {
      isScratchSettingOpen.value = !isScratchSettingOpen.value;
    }
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
    /* top: min(168.4px, 8.42vw); */
    /* left: min(299px, 14.95vw); */
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .prize {
    width: 20.5vw;
    max-width: 410px;
    height: 12.025vw;
    max-height: 240.5px;
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
    width: 20.5vw;
    max-width: 410px;
    height: 12.025vw;
    max-height: 240.5px;
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

  /* 按鈕群組：置中排列 */
  .btn-group {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  /* 基本按鈕 */
  .btn {
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    transition: 0.2s;
    box-shadow: 0 4px 0 rgba(0,0,0,0.2);
  }

  /* 藍色按鈕 */
  .btn.blue {
    background: #46aee0;
    color: #fff;
  }
  .btn.blue:hover {
    background: #3594c7;
  }

  /* 紫色按鈕 */
  .btn.purple {
    background: #7a66d0;
    color: #fff;
  }
  .btn.purple:hover {
    background: #5d4eb0;
  }

  .image-overlay {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 下層圖片 */
  .bg-img {
    width: 50vw;
    max-width: 1000px;
    height: auto;
  }

  /* 上層圖片外框 */
  .top-img-wrapper {
    position: absolute;
    /* display: flex; */
    display: inline-block;
    /* justify-content: center; */
    /* align-items: center; */
    border: 4px solid silver;   /* 銀色外框 */
    overflow: hidden;
  }
  
  /* 上層圖片 */
  .top-img {
    /* width: 20.5vw; */
    /* max-width: 410px; */
    height: auto;
    /* 移除底部行內元素間隙 */
    display: block;
    position: relative;
    z-index: 2;
  }

  .middle-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none;
    text-align: center;
    padding: 8px;
  }
  </style>