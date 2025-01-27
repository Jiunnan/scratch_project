<template>
    <div class="scratchView">
        <div class="scratch-object">
            <img class="backgroundImg" :src="ImagePath.backGroundImage_letizia_1"/>
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
                    :scratchRadius="scratchRadius"
                    @scratchStart="scratchStart" @scratchEnd="scratchEnd" @scratchAll="scratchAll">
                        <div class="prize">
                            <!-- <img class="prizeImg" :src="ImagePath.backGroundImage_letizia_1"/> -->
                             <div class="prizeShowDiv">
                                <label class="prizeString">{{ prize }}</label>
                             </div>
                        </div>
                </ScratchComponents>
            </div>
        </div>
        <br/><br/><br/>
        <div class="scratch-action">
            <div class="btn-reset" @click="reset">重置</div>
            <div class="popDiv">
                恭喜得到獎項：{{ prize }}
            </div>
        </div>
        <!-- <SidebarMenu :menu="menu" :theme="'white-theme'" @update:collapsed="onToggleCollapse" />
        <SidebarMenu :menu="menu" :theme="'white-theme'" :collapsed="true" :rtl="true" /> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import ScratchComponents from '@/components/ScratchComponents.vue';
import ScratchSettingComponents from '@/components/ScratchSettingComponents.vue';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import {ImagePath} from '../resources/web_image';
import { SidebarMenu } from 'vue-sidebar-menu';

const imageUrl = ref(ImagePath.backGroundImage_letizia_2);

const scratchRadius = window.innerWidth * 0.8 / 8;

const prizeArray = ['戴上紅鼻子戴上紅鼻子戴上紅鼻子戴上紅鼻子戴上紅鼻子', '百變百變5分鐘百變百變5分鐘百變百變5分鐘百變百變5分鐘百變百變5分鐘', '運動拖鞋波比跳運動拖鞋波比跳運動拖鞋波比跳運動拖鞋波比跳運動拖鞋波比跳', '微笑小蕾蕾微笑小蕾蕾微笑小蕾蕾微笑小蕾蕾微笑小蕾蕾微笑小蕾蕾', '這是測試這是測試這是測試這是測試這是測試這是測試這是測試這是測試這是測試這是測試這是測試']

const prize = ref('1000000 元');
const scratchCard = ref();
const isScratchComplete = ref(false);
const isSideBarOFF = ref(false);

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
}

function reset() {
    console.log('JN - scratch reset');
    const currentIndex = getRandomInt(0, prizeArray.length - 1);
    prize.value = prizeArray[Number(currentIndex)];
    console.log(`JN - 隨機選項:${currentIndex + 1} - ${prize.value}`);
    isScratchComplete.value = false;
    scratchCard.value?.reset();
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

onBeforeMount(() => {
    const currentIndex = getRandomInt(0, prizeArray.length - 1);
    prize.value = prizeArray[Number(currentIndex)];
    console.log(`JN - 隨機選項:${currentIndex + 1} - ${prize.value}`);
});

</script>

<style scoped>

.scratchView {
    display: flex;
    flex-direction: column;
}

.backgroundImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
    z-index: 1;
}

.scratch-object {
    width: 100%;
    height: auto;
}

.showScratchDiv {
    position: absolute;
    top: 17.52vw;
    left: 30vw;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.prize {
    width: 42.0875vw;
    height: 24.05vw;
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
    width: 24.05vw;
    height: 23.05vw;
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

.scratch-action {
    width: 100vw;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 99;
}

.btn-reset {
    display: block;
    width: 10vw;
    height: 2vw;
}

.popDiv {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>