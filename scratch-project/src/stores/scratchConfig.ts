import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ScratchSetting } from '@/models/ScratchSetting';
import { ImagePath } from '@/resources/web_image';

export const useScratchConfig  = defineStore('scratchConfig', () => {
    // 是否修改
    const isModified = ref(false);

    // 刮刮樂設定
    const setting  = ref<ScratchSetting>({
        backgroundImage: ImagePath.backGroundImage_letizia_1,
        maskImage: ImagePath.backGroundImage_letizia_2,
        scratchRatio: 100, // 100~150
        prizeFontSize: 20,  // 20~40
        prizeFontColor: '#000000',
        backgroundWhiteOpacity: 100
    });

    return {
        isModified,
        setting
    };
});