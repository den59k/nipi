const fs = require('fs')
const path = require('path')

function base (pathStr){
	return path.join(process.cwd(), '../frontend/public', pathStr)
}

async function mv(oldPath, targetFolder){
	const target = path.join(targetFolder, path.basename(oldPath))
	await fs.promises.rename(base(oldPath), base(target))

	return target
}

fs.mkdirSync(base('db/temp'), { recursive: true })
fs.mkdirSync(base('db/cases'), { recursive: true })

module.exports = { base, mv }