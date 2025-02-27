<template>
  <!-- 日历 -->
  <div v-if="destroy">
    <div :class="[name, showAnimation ? 'show' : '']" :style="getStyle" ref="calendarRef" @click.stop>
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
    <div :class="`${name}-mask`" @click.stop="onClose"></div>
  </div>
</template>

<script>
/**
 * 总展示天数, 6 排 7 列
 */
const total = 6 * 7

/**
 * 星期中文
 */
const week = Object.freeze(['日', '一', '二', '三', '四', '五', '六'])
/**
 * 月份中文
 */
const monthCn = Object.freeze(['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'])
let timerRef = null
/**
 * 加 0 补位
 */
const addZero = value => (value < 10 ? `0${value}` : `${value}`)
/**
 * 获取一个月有多少天
 * 原理: 获取一个月的最后一天天数即获得一个月有多少天
 * @param { number } y 年份
 * @param { number } m 月份，1 表示一月
 * new Date(2025, 2, 0) -> 2025 3 月的第 0 天表示 2 月的最后一天
 */
const getMonthDay = (y, m) => new Date(y, m, 0).getDate()

const name = 'm-simple-calendar'
export default {
  name,
  props: {
    value: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: ''
    },
    themeColor: {
      type: String,
      default: '#409eff'
    },
    closable: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: [String, Object]
    }
  },
  data() {
    return {
      name,
      curDate: {
        y: 0,
        m: 0,
        d: 0
      },
      days: [],
      week: [],
      showAnimation: false,
      destroy: false
    }
  },
  computed: {
    getStyle() {
      const style = this.customStyle || {}
      let option = {}
      if (typeof style === 'string') {
        style.split(';').map(item => {
          const [key, value] = item.split(':')
          key && (option[key] = value)
        })
      } else {
        option = style
      }
      return {
        ...option,
        '--theme': this.themeColor || '#409eff'
      }
    },
    dateInfo() {
      return {
        y: this.curDate.y,
        m: monthCn[this.curDate.m - 1]
      }
    }
  },
  methods: {
    initData() {
      /**
       * 当前时间
       */
      const now = new Date()
      const nowDate = `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(now.getDate())}`
      /**
       * 目标时间
       */
      const date = this.value ? new Date(this.value) : new Date()
      const curDays = []
      const [y, m, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      this.value && this.onUpdateValue(`${y}-${addZero(m)}-${addZero(d)}`)
      /**
       * 当月开始星期
       */
      const startW = new Date(y, m, 1).getDay()
      let nm = m - 1
      let ny = y
      if (nm === 0) {
        nm = 12
        ny--
      }
      /**
       * 上月总天数
       */
      const prevTotalDay = getMonthDay(ny, nm)
      Array.from({ length: startW }, (_, i) => {
        const newDay = prevTotalDay - i
        const tempDate = `${ny}-${nm}-${newDay}`
        curDays.push({ y: ny, m: nm, d: newDay, value: addZero(newDay), disabled: true, today: tempDate === nowDate })
      })
      /**
       * 当月总天数
       */
      const totalDay = getMonthDay(y, m)
      Array.from({ length: totalDay }, (_, i) => {
        const nd = i + 1
        const tempDate = `${y}-${addZero(m)}-${addZero(nd)}`
        const today = tempDate === nowDate
        const selected = this.value ? tempDate === this.value : false
        curDays.push({ y, m, d: nd, value: addZero(nd), today, selected })
      })
      /**
       * 下月
       */
      let nextM = m + 1
      let nextY = y
      if (nextM > 12) {
        nextM = 1
        nextY++
      }
      Array.from({ length: total - curDays.length }, (_, i) => {
        const nd = i + 1
        const tempDate = `${nextY}-${nextM}-${nd}`
        curDays.push({ y: nextY, m: nextM, d: nd, value: addZero(nd), disabled: true, today: tempDate === nowDate })
      })

      this.days = curDays
      this.curDate = { y, m, d }
    },
    onUpdateValue(value) {
      this.$emit('update:value', value)
      this.$emit('change', value)
    },
    onDayItem(item, index) {
      if (item.selected) return
      this.onUpdateValue(`${item.y}-${addZero(item.m)}-${addZero(item.d)}`)
      this.closable && this.$emit('update:visible', false)
      if (item.disabled) {
        this.$nextTick(this.initData)
        return
      }
      this.days.forEach((day, i) => {
        day.selected = i === index
      })
    },
    handleYearMonth(y, m, d) {
      const totalDay = getMonthDay(y, m)
      d > totalDay && (d = totalDay)
      this.onUpdateValue(`${y}-${addZero(m)}-${addZero(d)}`)
      this.$nextTick(this.initData)
    },
    onYearItem(calc) {
      const { y, m, d } = this.curDate
      const ny = y + calc
      this.handleYearMonth(ny, m, d)
    },
    onMonthItem(calc) {
      let { y, m, d } = this.curDate
      m += calc
      d = +d
      if (m > 12) {
        m = 1
        y++
      } else if (m === 0) {
        m = 12
        y--
      }
      this.handleYearMonth(y, m, d)
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    findCalendarRef(count = 0) {
      return new Promise((resolve, reject) => {
        if (count > 50) {
          reject(new Error('获取错误'))
          return
        }
        clearTimeout(timerRef)
        timerRef = setTimeout(() => {
          if (this.$refs.calendarRef) {
            resolve(true)
          } else {
            this.findCalendarRef(count + 1)
          }
        }, 100)
      })
    }
  },
  watch: {
    visible: {
      handler(bool) {
        if (bool) {
          this.initData()
          this.destroy = true
          this.findCalendarRef().then(() => {
            this.showAnimation = true
          })
        } else {
          this.showAnimation = false
          setTimeout(() => {
            this.destroy = false
          }, 300)
        }
      },
      immediate: true
    }
  }
}
</script>

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
