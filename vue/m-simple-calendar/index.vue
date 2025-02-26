<script setup>
import { name } from './config'
import { useHandle, useShow } from './hooks'

defineOptions({ name })

const emit = defineEmits(['change'])

const props = defineProps({
  themeColor: {
    type: String,
    default: '#409eff'
  },
  closable: {
    type: Boolean,
    default: false
  },
  style: {
    type: [String, Object]
  }
})

const modelValue = defineModel({ default: '' })
const visible = defineModel('visible', { default: false })
const { days, getStyle, week, dateInfo, onDayItem, initData, onYearItem, onMonthItem } = useHandle({ props, emit, modelValue, visible })
const { showAnimation, destroy, onClose } = useShow({ visible }, initData)
</script>
<template>
  <!-- 日历 -->
  <div :class="[name, showAnimation ? 'show' : '']" :style="getStyle" ref="calendarRef" @click.stop v-if="destroy">
    <div class="calendar-year">
      <view class="icon" @click="onYearItem(-1)">
        <img src="./assets/double-left.svg" />
      </view>
      <view class="icon" @click="onMonthItem(-1)">
        <img src="./assets/left.svg" />
      </view>
      <div class="year-center">
        <div class="month">{{ dateInfo.m }}月</div>
        <div>{{ dateInfo.y }}</div>
      </div>
      <view class="icon" @click="onMonthItem(1)">
        <img src="./assets/right.svg" />
      </view>
      <view class="icon" @click="onYearItem(1)">
        <img src="./assets/double-right.svg" />
      </view>
    </div>
    <div class="calendar-week">
      <div class="item" v-for="item in week" :key="item">
        <div class="item-box fixed">{{ item }}</div>
      </div>
    </div>
    <div class="calendar-day">
      <div class="item" v-for="(item, index) in days" :key="index" @click="onDayItem(item, index)">
        <div class="item-box" :class="{ disabled: item.disabled, selected: item.selected, today: item.today }">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
  <div :class="`${name}-mask`" @click.stop="onClose" v-if="destroy"></div>
</template>

<style scoped lang="less">
@color-default: #fff;
@color-disabled: rgba(0, 0, 0, 0.25);
@bg-default: #fff;
@bg-con: #ccc;
@bg-con-reduce: rgba(@bg-con, 36%);
@border-color-default: #dcdfe6;
@border-radius-default: 4px;
@font-color: #494949;
@font-color-reduce: #949494;
@font-size: 14px;
@shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
@day-px: 12px;
@day-py: 8px;

.m-simple-calendar {
  width: 280px;
  background: @bg-default;
  box-shadow: @shadow;
  transition: 0.3s opacity ease;
  opacity: 0;
  border-radius: @border-radius-default;
  color: @font-color;
  font-size: @font-size;
  position: relative;
  z-index: 100;

  &-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
  }

  &.show {
    opacity: 1;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 30px;

    &-box {
      width: 24px;
      height: 24px;
      border-radius: @border-radius-default;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @font-color;
      font-size: @font-size;
      border-radius: @border-radius-default;
      border: 1px solid transparent;

      &.selected {
        background: var(--theme) !important;
        border-color: var(--theme);
        color: @color-default;
      }

      &.today {
        border-color: var(--theme);
      }

      &.disabled {
        color: @color-disabled;
      }

      &.fixed {
        background: transparent !important;
      }
    }

    &:hover {
      .item-box {
        background: @bg-con-reduce;
      }
    }
  }

  .calendar-year {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid @border-color-default;
    padding: 0 @day-py;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 100%;
      cursor: pointer;
    }

    .year-center {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .month {
        margin-right: @day-py;
      }
    }
  }

  .calendar-week {
    padding: @day-py @day-px 0;
    display: flex;
    align-items: center;
  }

  .calendar-day {
    padding: 0 @day-px @day-py;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
  }
}
</style>
