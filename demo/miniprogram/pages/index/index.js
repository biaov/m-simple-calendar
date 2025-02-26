Page({
  data: {
    modelValue: '',
    visible: false
  },
  setVisible() {
    this.setData({ visible: true })
  },
  onUpdateVisible() {
    this.setData({ visible: false })
  },
  onUpdateValue(e) {
    this.setData({ modelValue: e.detail })
  }
})
