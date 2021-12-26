const requestAnimationFrame = (callback, interval = 20) => {
  let r = setTimeout(callback, interval)
  return r
}

const cancelAnimationFrame = (timeoutId) => {
  clearTimeout(timeoutId)
}

const isSameSecond = (first, second) => {
  return Math.floor(first / 1e3) === Math.floor(second / 1e3);
}

export class Countdown {
  /**
   * @property {number} timer - 倒计时的总时长，单位为毫秒
   * @property {number} millisecond - 是否按毫秒计算，默认为 false
   * @property {Function} onStart - 倒计时开始时的回调
   * @property {Function} onChange - 倒计时剩余时间改变时的回调
   * @property {Function} onCompleted - 倒计时结束时的回调
   */
  constructor(options = {}) {
    this.endTimestamp = 0
    this.millisecond = options.millisecond || false
    this.timer = options.timer
    this.remainTime = 0
    this.counting = false
    this.timeoutId = ''

    this.onStart = () => {
      if (typeof options.onStart === "function") {
        options.onStart(this)
      }
    }
    this.onChange = () => {
      if (typeof options.onChange === "function") {
        options.onChange(this)
      }
    }
    this.onCompleted = () => {
      if (typeof options.onCompleted === "function") {
        options.onCompleted(this)
      }
    }
  }


  destory() {
    this.endTimestamp = 0
    this.timer = 0
    this.remainTime = 0
    this.counting = 0
    this.timeoutId = 0
    this.onStart = null
    this.onChange = null
    this.onCompleted = null
  }

  start() {
    this.onStart()
    // 剩余时间默认为 timer
    this.setRemain(this.timer)
    if (!this.counting) {
      this.counting = true
      this.endTimestamp = Date.now() + this.remainTime
      this.tick()
    }
  }

  pause() {
    this.counting = false
    cancelAnimationFrame(this.timeoutId)
  }

  tick() {
    if (this.millisecond) {
      this.microTick()
    } else {
      this.macroTick()
    }
  }

  /**
   * 毫秒级倒计时
   */
  microTick() {
    this.timeoutId = requestAnimationFrame(() => {
      if (this.counting) {
        this.setRemain(this.getRemain())
        if (this.remainTime > 0) {
          this.microTick()
        }
      }
    });
  }

  /**
   * 秒级倒计时
   */
  macroTick() {
    this.timeoutId = requestAnimationFrame(() => {
      if (this.counting) {
        const remainTime = this.getRemain()
        if (!(isSameSecond(remainTime, this.remainTime) && remainTime !== 0)) {
          this.setRemain(remainTime)
        }
        if (this.remainTime > 0) {
          this.macroTick()
        }
      }
    }, 900)
  }

  getRemain() {
    return Math.max(this.endTimestamp - Date.now(), 0)
  }

  setRemain(time) {
    this.remainTime = time
    this.onChange()

    if (time === 0) {
      this.pause()
      this.onCompleted()
    }
  }
}
