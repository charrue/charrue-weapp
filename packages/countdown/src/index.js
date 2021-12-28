import { Countdown } from "./countdown-model"
import { parseTimeData, formatTime } from "./utils"

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    /**
     * 倒计时时长，单位毫秒
     */
    time: {
      type: Number,
      optionalTypes: [Number, String],
      value: 0,
    },
    /**
     * 是否开启毫秒级渲染
     */
     millisecond: Boolean,
    /**
     * 时间格式
     */
    format: {
      type: String,
      value: "HH:mm:ss"
    },
    /**
     * 是否自动开始倒计时
     */
    autostart: {
      type: Boolean,
      value: true
    },
    /**
     * 是否分段显示
     */
    multiSegments: Boolean,
    customClass: String,
    numberClass: String,
    separatorClass: String,
  },
  data: {
    /**
     * 倒计时剩余时间
     */
    remain: 0,
    /**
     * requestAnimationFrame 的请求id，用于取消由 requestAnimationFrame 添加到计划中的动画帧请求
     */
    requestAnimationFrameId: 0,
    keepAlivePaused: false,
    /**
     * 正在倒计时
     */
    counting: false,
    /**
     * 结束时间的时间戳
     */
    endTimestamp: 0,
    /**
     * 倒计时结束时的格式化时间
     * @property { string } days
     * @property { string } hours
     * @property { string } minutes
     * @property { string } seconds
     * @property { string } milliseconds
     */
    timeData: {},
    /**
     * 时间格式化
     */
    timeSegments: [],
    formattedTime: ""
  },
  observers: {
    millisecond(val) {
      if (val) {
        this.setData({
          format: "HH:mm:ss:SSS"
        })
      }
    },
    time(val) {
      if (this.countdownModel) {
        // 在created阶段，time和millisecond都是默认值，在值更新后，需要同步更新到Countdown Model
        this.countdownModel.timer = val
        this.countdownModel.millisecond = this.data.millisecond
      }
      this.reset();
    },
    remain(val) {
      this.setData({
        timeData: parseTimeData(val)
      })
    },
    "format, timeData"(format, timeData) {
      this.setData({
        formattedTime: formatTime(format, timeData)
      });
    },
    formattedTime(t) {
      this.setData({
        timeSegments: null == t ? undefined : t.replace(/(\D+)/g, " $1 ").split(/\s/g)
      });
    }
  },
  lifetimes: {
    created() {
      this.countdownModel = new Countdown({
        timer: this.data.time,
        millisecond: this.data.millisecond,
        onChange: (ctx) => {
          this.setData({
            remain: ctx.remainTime
          })
        }
      })
    },
    attached() {
      if (this.data.keepAlivePaused) {
        this.setData({
          keepAlivePaused: false,
          counting: true
        })
        this.tick()
      }
    },
    detached() {
      if (this.data.counting) {
        this.pause()
        this.setData({
          keepAlivePaused: true
        })
      }

      this.countdownModel.destory()
      this.countdownModel = null
    },
  },
  methods: {
    start() {
      this.countdownModel.start()
      this.setData({
        counting: this.countdownModel.counting,
        endTimestamp: this.countdownModel.endTimestamp
      })
    },
    pause() {
      this.countdownModel.pause()
      this.setData({
        counting: this.countdownModel.counting
      })
    },
    reset() {
      this.pause()
      this.setData({
        remain: this.data.time,
      })
      if (this.data.autostart) {
        this.start()
      }
    },
  }
})