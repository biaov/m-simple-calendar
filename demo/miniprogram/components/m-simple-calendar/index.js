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

Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    visible: {
      type: Boolean,
      value: '',
      observer(bool) {
        if (bool) {
          this.initData()
          this.setData({ destroy: true })
          this.findCalendarRef().then(() => {
            this.setData({ showAnimation: true })
          })
        } else {
          this.setData({ showAnimation: false })
          setTimeout(() => {
            this.setData({ destroy: false })
          }, 300)
        }
      }
    },
    themeColor: {
      type: String,
      value: '#409eff'
    },
    closable: {
      type: Boolean,
      value: false
    },
    style: {
      type: String,
      optionalTypes: [Object]
    }
  },
  data: {
    getStyle: {},
    dateInfo: {
      y: 0,
      m: 0
    },
    name: 'm-simple-calendar',
    calendarRef: null,
    curDate: {
      y: 0,
      m: 0,
      d: 0
    },
    days: [],
    week: [],
    showAnimation: false,
    destroy: false
  },
  methods: {
    setDateInfo() {
      const { curDate } = this.data
      if (!curDate) return
      const { y, m } = curDate
      this.setData({
        dateInfo: {
          y,
          m: monthCn[m - 1]
        }
      })
    },
    setStyle() {
      const style = this.data.style || {}
      let option = {}
      if (typeof style === 'string') {
        style.split(';').map(item => {
          const [key, value] = item.split(':')
          key && (option[key] = value)
        })
      } else {
        option = style
      }
      const res = {
        ...option,
        '--theme': this.data.themeColor || '#409eff'
      }
      const getStyle = Object.keys(res).reduce((prev, key) => `${prev}${key}:${res[key]};`, '')
      this.setData({ getStyle })
    },
    initData() {
      const { value } = this.data
      /**
       * 当前时间
       */
      const now = new Date()
      const nowDate = `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(now.getDate())}`
      /**
       * 目标时间
       */
      const date = value ? new Date(value) : new Date()
      const curDays = []
      const [y, m, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      value && this.onUpdateValue(`${y}-${addZero(m)}-${addZero(d)}`)
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
        const selected = value ? tempDate === value : false
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

      this.setData({
        days: curDays,
        curDate: { y, m, d }
      })
    },
    onUpdateValue(value) {
      this.triggerEvent('update:value', value)
      this.triggerEvent('change', value)
    },
    onDayItem(e) {
      const { days } = this.data
      const { index } = e.currentTarget.dataset
      const item = days[index]
      if (item.selected) return
      this.onUpdateValue(`${item.y}-${addZero(item.m)}-${addZero(item.d)}`)
      this.closable && this.triggerEvent('update:visible', false)
      if (item.disabled) {
        wx.nextTick(this.initData.bind(this))
        return
      }
      days.forEach((day, i) => {
        day.selected = i === index
      })
      this.setData({ days })
    },
    handleYearMonth(y, m, d) {
      const totalDay = getMonthDay(y, m)
      d > totalDay && (d = totalDay)
      this.onUpdateValue(`${y}-${addZero(m)}-${addZero(d)}`)
      wx.nextTick(this.initData.bind(this))
    },
    onYearItem(e) {
      const { value: calc } = e.currentTarget.dataset
      const { y, m, d } = this.data.curDate
      const ny = y + +calc
      this.handleYearMonth(ny, m, d)
    },
    onMonthItem(e) {
      const { value: calc } = e.currentTarget.dataset
      let { y, m, d } = this.data.curDate
      m += +calc
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
      this.triggerEvent('update:visible', false)
    },
    findCalendarRef(count = 0) {
      return new Promise((resolve, reject) => {
        if (count > 50) {
          reject(new Error('获取错误'))
          return
        }
        wx.createSelectorQuery()
          .in(this)
          .select(`.${this.data.name}`)
          .boundingClientRect(res => {
            if (!res) return
            clearTimeout(this.timerRef)
            this.timerRef = setTimeout(() => {
              if (res) {
                resolve(res)
              } else {
                this.findCalendarRef(count + 1)
              }
            }, 100)
          })
          .exec()
      })
    }
  },
  lifetimes: {
    attached() {
      this.initData()
      this.setStyle()
    }
  },
  observers: {
    curDate() {
      this.setDateInfo()
    },
    'style,themeColor'() {
      this.setStyle()
    }
  }
})
