import * as fs from 'node:fs'
import * as path from 'node:path'
import * as fsPromises from 'node:fs/promises'

// 创建目标文件夹名称
const targetFolder = 'util6-diagram-drag'

// 异步函数来执行复制操作
async function copyPlugin() {
  try {
    // 删除现有目标文件夹（如果存在）
    if (fs.existsSync(targetFolder)) {
      await fsPromises.rm(targetFolder, { recursive: true, force: true })
    }
    
    // 创建新的目标文件夹
    await fsPromises.mkdir(targetFolder, { recursive: true })
    
    // 复制 dist 目录下的所有文件到目标文件夹
    const distFiles = await fsPromises.readdir('dist')
    for (const file of distFiles) {
      await fsPromises.copyFile(
        path.join('dist', file),
        path.join(targetFolder, file)
      )
    }
    
    // 复制 manifest.json 文件
    await fsPromises.copyFile(
      'src/manifest.json',
      path.join(targetFolder, 'manifest.json')
    )
    
    console.log(`插件打包成功！文件已复制到 ${targetFolder} 文件夹中。`)
  } catch (err) {
    console.error('打包过程中出错:', err)
  }
}

// 执行复制
copyPlugin()
