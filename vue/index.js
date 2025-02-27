import MSimpleCalendar from './m-simple-calendar'
export { default as MSimpleCalendar } from './m-simple-calendar'

export default {
  install(app) {
    app.component(MSimpleCalendar.name, MSimpleCalendar)
  }
}
