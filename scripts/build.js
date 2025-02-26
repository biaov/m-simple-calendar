import { cpSync, existsSync, rmSync, mkdirSync } from 'fs'
import { resolve } from 'path'

/**
 * 复制平台
 */
const cpPlatform = (source, dest) => {
  existsSync(dest) && rmSync(dest, { recursive: true })
  mkdirSync(dest)
  cpSync(source, dest, { recursive: true })
}

;['vue', 'miniprogram'].forEach(name => {
  const source = resolve(import.meta.dirname, `../demo/${name}/components`)
  const dest = resolve(import.meta.dirname, `../${name}`)
  cpPlatform(source, dest)
})
