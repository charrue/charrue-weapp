const fs = require('fs');
const path = require('path');
const { green, blue, bgBlue } = require("kolorist")
const watch = require('node-watch');
const ncp = require("ncp")
const src = path.resolve(__dirname, '../packages');
const dist = path.resolve(__dirname, '../example/dist');

ncp.limit = 16;

console.log(bgBlue('watch started!'))
watch(path.resolve(__dirname, '../packages'), { recursive: true }, function (evt, name) {
  const packageNameReg = /packages\\(\w+)\\src/
  const matches = packageNameReg.exec(name)

  if (matches && matches[1]) {
    const packageName = matches[1]
    console.log(blue(`${packageName} changed ☛`))

    const packageDist = path.join(dist, packageName)
    if (!fs.existsSync(packageDist)) {
      fs.mkdirSync(packageDist)
    }

    ncp(
      path.join(src, packageName, 'src'),
      path.join(dist, packageName),
      (err) => {
        if (err) {
          console.error(err)
          return
        }

        console.log(green(`${packageName} moved ✔`))
      }
    )
  }
})
