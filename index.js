const fs = require('fs')
const path = require('path')

const INPUT = {}

function CheckPath(name, next) {
  try { fs.statSync(name) } catch { next(name) }
}

function CreatePath(name, folder) {
  return path.join(folder || process.cwd(), name)
}

function CreateTemplate(option) {
  const TEMPLATE = fs.readFileSync(option.html ? CreatePath(option.html) : CreatePath('template.html', __dirname), 'utf-8')

  option.list.forEach(i => {
    let template = i.html ? fs.readFileSync(CreatePath(i.html), 'utf-8') : TEMPLATE

    template = template.replace('<%= ICON %>', i.icon || option.icon || '')
    template = template.replace('<%= TITLE %>', i.title || i.name)
    template = template.replace('<%= SRC %>', i.entry || `/src/pages/${i.name}/index.js`)

    fs.writeFileSync(INPUT[i.name], template)
  })
}

module.exports = function(option) {
  option = Array.isArray(option) ? { list: option } : option
  option.list.forEach(i => INPUT[i.name] = CreatePath(`template/${i.name}.html`))

  CheckPath(CreatePath('template'), name => fs.mkdirSync(name))
  CreateTemplate(option)

  return {
    name: 'multiple-pages',
    config(config) {
      config.build = config.build || {}
      config.build.rollupOptions = config.build.rollupOptions || {}
      config.build.rollupOptions.input = INPUT
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let target = req._parsedUrl.pathname.slice(1) || 'index'

        if (option.list.some(i => i.name == target)) {
          let file = fs.readFileSync(CreatePath(`/template/${target}.html`), 'utf-8')
          res.setHeader('Content-Length', Buffer.byteLength(file, 'utf8'))
          res.end(file)
        } else {
          next()
        }
      })
    },
    handleHotUpdate(config) {
      config.file.endsWith('.html') && CreateTemplate(option)
    }
  }
}
