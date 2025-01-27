<template>
    <div class="scratch-setting">
        <div class="input-box">
            <textarea type="text" v-model="scratchSettingValue"></textarea>    
            <button @click="addPrize">+</button>
        </div>
        <ul>
            <li v-for="(item, index) in prizeArray" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCounterStore } from '@/store/counter';

const scratchSettingValue = ref('');

const prizeArray = ref<Array<string>>([]);


function addPrize() {
    if (scratchSettingValue.value != '') {
        console.log('JN - ', scratchSettingValue.value);
        const stringArr = scratchSettingValue.value.split("\n");
        console.log('JN - ', stringArr);
        prizeArray.value.push(...stringArr);
        console.log('JN - ', prizeArray.value);
        scratchSettingValue.value = '';
    }
}
</script>

<style scoped>
.scratch-setting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.input-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

</style>