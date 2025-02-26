<script setup>
import { ref } from 'vue'
import MSimpleCalendarV2 from '../components/m-simple-calendar-v2'

const modelValue = ref()
const visible = ref(false)
const setVisible = value => {
  visible.value = value
}

const modelValue2 = ref()
const visible2 = ref(false)
const setVisible2 = value => {
  visible2.value = value
}
</script>

<template>
  <div class="demo">
    <div class="row" @click="setVisible(true)">弹出日历: {{ modelValue || '' }}</div>
    <m-simple-calendar v-model:visible="visible" v-model="modelValue" style="position: absolute; top: 100px; left: 50px" />
  </div>
  <div class="demo">
    <div class="row" @click="setVisible2(true)">弹出日历-v2: {{ modelValue2 || '' }}</div>
    <m-simple-calendar-v2 v-model:visible="visible2" v-model:value="modelValue2" style="position: absolute; top: 100px; left: 50px" />
  </div>
</template>
<style scoped lang="less">
.demo {
  position: relative;
  padding: 50px;

  .row {
    width: 300px;
    height: 40px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    padding: 0 16px;
  }
}
</style>
