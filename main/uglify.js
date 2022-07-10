var UglifyJS = require("uglify-es");
var fs = require('fs')
const { remove } = require('fs-extra')
const { join } = require('path');
let array = []//src文件夹内的js目录集合
let codeArray = []//压缩后的代码集合
let basePath = join(__dirname, '../')
const options = {
    //*******配置输入输出口*********/
    Entrypath: '.Main',//需要批量压缩js的文件夹入口
    Outpath: '.Main-temp',//批量压缩后js的文件夹

    warnings: false,
    parse: {
        // parse options
    },
    compress: {
        // compress options
    },
    mangle: {
        // mangle options

        properties: {
            // mangle property options
        }
    },
    output: {
        // output options
    },
    nameCache: null, // or specify a name cache object
    toplevel: false,
    ie8: false,
}

init()//开始


//执行写入压缩后的代码
async function startCompress() {
    for (let i = 0; i < array.length; i++) {
        const originPath = join(basePath, 'main', options.Entrypath, array[i])
        try {
            await fs.promises.writeFile(join(basePath, options.Outpath, array[i]), codeArray[i])
            // 同步解压缩
            console.log(`写入第${i + 1}条压缩后代码成功`)
        } catch (err) {
            console.log(`写入第${i + 1}条压缩后代码失败`)
            console.log(err.message)
            process.exit()
        }
    }
}
//遍历入口文件夹
async function startLoop(parent = '') {
    const dir = await fs.promises.opendir(join(basePath, 'main', options.Entrypath, parent))
    for await (const dirent of dir) {
        const curPath = join(parent, dirent.name)
        if (dirent.isDirectory()) {
            await startLoop(curPath)
        } else {
            if (dirent.name.endsWith('js') || dirent.name.endsWith('json')) {
                array.push(join(parent, dirent.name))
            }
        }
    }
}
async function checkItemExit(item) {
    let pathArray = item.split('/')
    let curBasePath = join(basePath, options.Outpath)

    pathArray = pathArray.slice(0, pathArray.length - 1)
    for (let i = 0; i < pathArray.length; i++) {
        if (!fs.existsSync(join(curBasePath, pathArray[i]))) {
            await fs.promises.mkdir(join(curBasePath, pathArray[i]))
        }
        curBasePath = join(curBasePath, pathArray[i])
    }
}
//导入uglifyCode
async function toUglify() {
    for (let i = 0; i < array.length; i++) {
        const item = array[i]
        await checkItemExit(item)
        console.log(join(basePath, options.Entrypath, item))
        let code = fs.readFileSync(join(basePath, 'main', options.Entrypath, item), "utf8");
        if (join(basePath, options.Entrypath, item).endsWith('json')) {
            codeArray.push(code)
        } else {
            let uglifyCode = UglifyJS.minify(code).code;
            codeArray.push(uglifyCode)
        }
    }
}
//初始化
async function init() {
    console.log('创建输入目录')
    if (fs.existsSync(join(basePath, options.Entrypath))) {
        await remove(join(basePath, options.Entrypath))
    }
    if (!fs.existsSync(join(basePath, options.Outpath))) {
        await fs.promises.mkdir(join(basePath, options.Outpath))
    }
    console.log('遍历文件')
    await startLoop()
    console.log(`遍历${options.Entrypath}目录成功,共有${array.length}个js文件`)
    console.log('执行uglify,压缩代码')
    await toUglify()
    await startCompress()
    await fs.renameSync(join(basePath, options.Outpath), join(basePath, options.Entrypath))
    console.log('压缩代码完成')
}