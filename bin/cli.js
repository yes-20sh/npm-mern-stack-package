#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import readline from 'node:readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')

// Read package.json version
const pkgJsonPath = path.join(packageRoot, 'package.json')
let version = '1.0.0'
if (fs.existsSync(pkgJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    if (pkg.version) version = pkg.version
  } catch {}
}

// ANSI colors for clean, zero-dependency terminal output
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
}

const printBanner = () => {
  console.log(`
${c.cyan}${c.bold}  ███╗   ███╗███████╗██████╗ ███╗   ██╗
  ████╗ ████║██╔════╝██╔══██╗████╗  ██║
  ██╔████╔██║█████╗  ██████╔╝██╔██╗ ██║
  ██║╚██╔╝██║██╔══╝  ██╔══██╗██║╚██╗██║
  ██║ ╚═╝ ██║███████╗██║  ██║██║ ╚████║
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝${c.reset}
  ${c.magenta}${c.bold}@yes20sh/create-mern-stack-app${c.reset} ${c.dim}v${version}${c.reset}
  ${c.gray}React + Vite + TailwindCSS + Express + MongoDB${c.reset}
  ${c.gray}Created by ${c.white}${c.bold}Yashraj Singh Solanki${c.reset} ${c.cyan}<yes20sh@outlook.com>${c.reset}
`)
}

const printHelp = () => {
  printBanner()
  console.log(`${c.bold}Usage:${c.reset}
  ${c.cyan}npx @yes20sh/create-mern-stack-app${c.reset} [project-name] [options]

${c.bold}Options:${c.reset}
  ${c.yellow}-i, --install${c.reset}     Automatically install all dependencies
  ${c.yellow}--no-install${c.reset}      Skip dependency installation
  ${c.yellow}-y, --yes${c.reset}         Accept all defaults non-interactively
  ${c.yellow}-v, --version${c.reset}     Show CLI version
  ${c.yellow}-h, --help${c.reset}        Show this help message

${c.bold}Examples:${c.reset}
  ${c.gray}# Interactive setup:${c.reset}
  npx @yes20sh/create-mern-stack-app my-mern-app

  ${c.gray}# Non-interactive with automatic installation:${c.reset}
  npx @yes20sh/create-mern-stack-app my-mern-app --install -y
`)
}

const promptQuestion = (query, defaultValue = '') => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const displayPrompt = defaultValue
      ? `${query} ${c.dim}(${defaultValue})${c.reset} `
      : `${query} `

    rl.question(displayPrompt, (answer) => {
      rl.close()
      const trimmed = answer.trim()
      resolve(trimmed || defaultValue)
    })
  })
}

// Filter files that should never be copied into a fresh starter project
const shouldIgnore = (filename) => {
  const ignored = [
    'node_modules',
    'dist',
    '.git',
    '.DS_Store',
    'Thumbs.db',
    'package-lock.json',
  ]
  return ignored.includes(filename)
}

// Recursive directory copy with filename remapping and exclusions
const copyDirectory = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)

    if (shouldIgnore(entry.name)) {
      continue
    }

    // Remap gitignore variants back to .gitignore
    let destName = entry.name
    if (entry.name === '_gitignore' || entry.name === '.npmignore') {
      destName = '.gitignore'
    }

    const destPath = path.join(dest, destName)

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === 'win32' ? `${command}.cmd` : command
    const child = spawn(npmCmd, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command '${command} ${args.join(' ')}' exited with code ${code}`))
      }
    })

    child.on('error', (err) => {
      reject(err)
    })
  })
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log(`v${version}`)
    process.exit(0)
  }

  printBanner()

  // Parse flags
  const autoInstall = args.includes('-i') || args.includes('--install')
  const noInstall = args.includes('--no-install')
  const defaultYes = args.includes('-y') || args.includes('--yes')

  // Find target project name from positional argument
  let targetArg = args.find((arg) => !arg.startsWith('-'))

  let projectName = targetArg
  if (!projectName) {
    if (defaultYes) {
      projectName = 'my-mern-app'
    } else {
      projectName = await promptQuestion(
        `${c.cyan}?${c.reset} ${c.bold}What is your project name?${c.reset}`,
        'my-mern-app'
      )
    }
  }

  projectName = projectName.replace(/\s+/g, '-').toLowerCase()
  const targetDir = path.resolve(process.cwd(), projectName)

  // Validate directory state
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir)
    if (files.length > 0) {
      if (!defaultYes) {
        const overwriteAnswer = await promptQuestion(
          `${c.yellow}?${c.reset} Target directory ${c.bold}${projectName}${c.reset} is not empty. Overwrite existing files? ${c.dim}(y/N)${c.reset}`
        )
        if (overwriteAnswer.toLowerCase() !== 'y' && overwriteAnswer.toLowerCase() !== 'yes') {
          console.log(`${c.red}✖${c.reset} Aborted by user.`)
          process.exit(1)
        }
      }
    }
  } else {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  console.log(`\n${c.blue}ℹ${c.reset} Creating MERN application in ${c.bold}${targetDir}${c.reset}...\n`)

  // 1. Copy API template
  const apiSrc = path.join(packageRoot, 'api')
  const apiDest = path.join(targetDir, 'api')
  console.log(`  ${c.cyan}→${c.reset} Scaffolding API backend (Express + Mongoose)...`)
  copyDirectory(apiSrc, apiDest)

  // Ensure api/.env is generated from .env.example if missing
  const apiEnvExample = path.join(apiDest, '.env.example')
  const apiEnv = path.join(apiDest, '.env')
  if (fs.existsSync(apiEnvExample) && !fs.existsSync(apiEnv)) {
    fs.copyFileSync(apiEnvExample, apiEnv)
  }

  // Update api package.json name
  const apiPkgPath = path.join(apiDest, 'package.json')
  if (fs.existsSync(apiPkgPath)) {
    const apiPkg = JSON.parse(fs.readFileSync(apiPkgPath, 'utf-8'))
    apiPkg.name = `${projectName}-api`
    fs.writeFileSync(apiPkgPath, JSON.stringify(apiPkg, null, 2) + '\n')
  }

  // 2. Copy Web template
  const webSrc = path.join(packageRoot, 'web')
  const webDest = path.join(targetDir, 'web')
  console.log(`  ${c.cyan}→${c.reset} Scaffolding Web frontend (React + Vite + TailwindCSS)...`)
  copyDirectory(webSrc, webDest)

  // Ensure web/.env is generated from .env.example if missing
  const webEnvExample = path.join(webDest, '.env.example')
  const webEnv = path.join(webDest, '.env')
  if (fs.existsSync(webEnvExample) && !fs.existsSync(webEnv)) {
    fs.copyFileSync(webEnvExample, webEnv)
  }

  // Update web package.json name
  const webPkgPath = path.join(webDest, 'package.json')
  if (fs.existsSync(webPkgPath)) {
    const webPkg = JSON.parse(fs.readFileSync(webPkgPath, 'utf-8'))
    webPkg.name = `${projectName}-web`
    fs.writeFileSync(webPkgPath, JSON.stringify(webPkg, null, 2) + '\n')
  }

  // 3. Copy Root Monorepo configuration
  const templatesRoot = path.join(packageRoot, 'templates', 'root')
  console.log(`  ${c.cyan}→${c.reset} Generating root monorepo & orchestration scripts...`)

  // Root package.json
  const rootPkgTemplate = path.join(templatesRoot, 'package.json.template')
  if (fs.existsSync(rootPkgTemplate)) {
    let rootPkgContent = fs.readFileSync(rootPkgTemplate, 'utf-8')
    rootPkgContent = rootPkgContent.replace(/{{PROJECT_NAME}}/g, projectName)
    fs.writeFileSync(path.join(targetDir, 'package.json'), rootPkgContent)
  }

  // Root .gitignore
  const rootGitignoreTemplate = path.join(templatesRoot, '_gitignore.template')
  if (fs.existsSync(rootGitignoreTemplate)) {
    const gitignoreContent = fs.readFileSync(rootGitignoreTemplate, 'utf-8')
    fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignoreContent)
  }

  // Root README.md
  const rootReadmeTemplate = path.join(templatesRoot, 'README.md.template')
  if (fs.existsSync(rootReadmeTemplate)) {
    let readmeContent = fs.readFileSync(rootReadmeTemplate, 'utf-8')
    readmeContent = readmeContent.replace(/{{PROJECT_NAME}}/g, projectName)
    fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent)
  }

  console.log(`\n${c.green}✔${c.reset} All files and folders generated successfully!`)

  // 4. Handle dependency installation
  let shouldInstall = autoInstall
  if (!autoInstall && !noInstall) {
    if (defaultYes) {
      shouldInstall = true
    } else {
      const installAnswer = await promptQuestion(
        `\n${c.cyan}?${c.reset} ${c.bold}Would you like to install dependencies now?${c.reset} ${c.dim}(Y/n)${c.reset}`,
        'y'
      )
      shouldInstall = installAnswer.toLowerCase() === 'y' || installAnswer.toLowerCase() === 'yes'
    }
  }

  if (shouldInstall) {
    console.log(`\n${c.blue}ℹ${c.reset} Installing dependencies (this may take a minute)...\n`)
    try {
      console.log(`${c.dim}[1/3] Installing root dependencies (concurrently)...${c.reset}`)
      await runCommand('npm', ['install'], targetDir)

      console.log(`\n${c.dim}[2/3] Installing API dependencies...${c.reset}`)
      await runCommand('npm', ['install'], path.join(targetDir, 'api'))

      console.log(`\n${c.dim}[3/3] Installing Web dependencies...${c.reset}`)
      await runCommand('npm', ['install'], path.join(targetDir, 'web'))

      console.log(`\n${c.green}✔${c.reset} All dependencies installed successfully!`)
    } catch (err) {
      console.error(`\n${c.yellow}⚠️  Dependency installation encountered an issue:${c.reset} ${err.message}`)
      console.log(`You can run ${c.cyan}npm run install:all${c.reset} manually inside ${projectName}.`)
    }
  }

  // 5. Final Instructions
  console.log(`
${c.green}${c.bold}====================================================${c.reset}
${c.green}${c.bold}  🚀 Your MERN application is ready!${c.reset}
${c.green}${c.bold}====================================================${c.reset}

Next steps to get started:

  ${c.cyan}cd${c.reset} ${projectName}${!shouldInstall ? `\n  ${c.cyan}npm run install:all${c.reset}` : ''}
  ${c.cyan}npm run dev${c.reset}

${c.bold}URLs:${c.reset}
  ${c.magenta}Frontend:${c.reset}   http://localhost:5173
  ${c.magenta}Backend API:${c.reset} http://localhost:5000
  ${c.magenta}Health Check:${c.reset}http://localhost:5000/api/health

${c.dim}Happy building! Developed by Yashraj Singh Solanki <yes20sh@outlook.com>.${c.reset}
`)
}

main().catch((err) => {
  console.error(`\n${c.red}Fatal Error:${c.reset}`, err)
  process.exit(1)
})
