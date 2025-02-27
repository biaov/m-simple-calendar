import { cpSync, existsSync, rmSync, mkdirSync } from 'fs'
import { resolve, join } from 'path'

/**
 * 复制平台
 */
const cpPlatform = (source, dest) => {
  existsSync(dest) && rmSync(dest, { recursive: true })
  mkdirSync(dest)
  cpSync(source, dest, { recursive: true })
}

const outDist = resolve(import.meta.dirname, `../dist`)
existsSync(outDist) && rmSync(outDist, { recursive: true })
mkdirSync(outDist)

;['vue', 'miniprogram'].forEach(name => {
  const source = join(import.meta.dirname, `../demo/${name}/components`)
  const dest = join(outDist, `${name}`)
  cpPlatform(source, dest)
})
