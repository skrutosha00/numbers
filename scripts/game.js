import { changeBalance, randInt, setBalanceField } from './functions.js'

setBalanceField()

let balance = document.querySelector('.balance')
let ball = document.querySelector('.ball')
let betAmount = document.querySelector('.bet_amount')
let warning = document.querySelector('.warning')
let autoOptionCont = document.querySelector('.auto_option_cont')

let active = true
let chosenNums = {}

let coordinates = [
    [0, 0, 29],
    [-30, 35, 18],
    [-45, 70, 22],
    [-40, 105, 9],
    [-35, 140, 31],
    [-5, 175, 14],
    [60, 210, 20],
    [125, 240, 1],
    [220, 260, 33],
    [315, 275, 16],
    [410, 290, 24],
    [510, 295, 5],
    [625, 300, 10],
    [725, 295, 23],
    [825, 275, 8],
    [925, 260, 30],
    [1025, 240, 11],
    [1080, 210, 36],
    [1150, 175, 13],
    [1200, 140, 27],
    [1225, 105, 6],
    [1235, 70, 34],
    [1200, 35, 17],
    [1175, 0, 25],
    [1140, -25, 2],
    [1075, -60, 21],
    [1000, -85, 4],
    [900, -110, 19],
    [800, -120, 15],
    [700, -130, 32],
    [480, -130, 26],
    [380, -120, 3],
    [280, -100, 35],
    [200, -85, 12],
    [120, -60, 28],
    [60, -30, 7]
]
let lastNumbers = []

for (let fieldClass of ['f_top', 'f_bottom']) {
    let field = document.querySelector('.' + fieldClass)

    for (let i = 0; i < 10; i++) {
        let cell = document.createElement('div')
        cell.classList.add('cell', fieldClass + '_cell', 'block')

        let innerCell = document.createElement('div')
        innerCell.classList.add('inner_cell', fieldClass + '_inner_cell', 'block', 'hidden')
        innerCell.innerHTML = randInt(1, 36)

        innerCell.onclick = () => {
            if (chosenNums[fieldClass] || betAmount.innerHTML == 0 || Number(betAmount.innerHTML) > Number(balance.innerHTML)) { return }

            innerCell.classList.remove('hidden')
            chosenNums[fieldClass] = {}
            chosenNums[fieldClass].index = i
            chosenNums[fieldClass].num = innerCell.innerHTML
        }

        cell.appendChild(innerCell)
        field.appendChild(cell)
    }
}

for (let autoAmount of [5, 10, 15, 20]) {
    let autoOption = document.createElement('div')
    autoOption.classList.add('auto_option', 'block')
    autoOption.innerHTML = autoAmount

    autoOptionCont.appendChild(autoOption)

    autoOption.onclick = () => {
        if (!active || betAmount.innerHTML == 0 || Number(betAmount.innerHTML) > Number(balance.innerHTML)) { return }

        autoOptionCont.style.bottom = '-60%'
        let amount = Number(autoOption.innerHTML)
        let step = 1

        autoStep()
        let autoInterval = setInterval(() => {
            autoStep()
            step++

            if (step == amount) {
                clearInterval(autoInterval)
            }
        }, 12000);

        function autoStep() {
            document.querySelectorAll('.f_top_inner_cell')[0].click()
            document.querySelectorAll('.f_bottom_inner_cell')[0].click()

            setTimeout(() => {
                document.querySelector('.spin').click()
            }, 1000);

            setTimeout(() => {
                document.querySelector('.again').click()
            }, 10000);
        }
    }
}

for (let i = 0; i < 6; i++) {
    let last = document.createElement('div')
    last.classList.add('last', 'block')

    document.querySelector('.last_cont').appendChild(last)
}

updateLast()

document.querySelector('.plus').onclick = () => {
    if (Number(betAmount.innerHTML) + 10 > Number(balance.innerHTML) || !active) { return }

    betAmount.innerHTML = Number(betAmount.innerHTML) + 50
}

document.querySelector('.minus').onclick = () => {
    if (!active || Number(betAmount.innerHTML) - 50 < 0) { return }

    betAmount.innerHTML = Number(betAmount.innerHTML) - 50
}

document.querySelector('.spin').onclick = async () => {
    if (Object.keys(chosenNums).length != 2) { return }
    active = false
    changeBalance(-Number(betAmount.innerHTML))

    let result = await rotate()

    lastNumbers.unshift(result)
    updateLast()

    for (let fieldClass of ['f_top', 'f_bottom']) {
        let r = randInt(1, 6)
        let i = chosenNums[fieldClass].index + r
        if (i > 7) { i -= 8 }

        let innerCell = document.querySelectorAll('.' + fieldClass + '_inner_cell')[i]
        innerCell.innerHTML = result
        innerCell.classList.remove('hidden')
    }

    setTimeout(() => {
        gameOver(chosenNums.f_top.num == result || chosenNums.f_bottom.num == result)
    }, 1000);
}

document.querySelector('.again').onclick = () => {
    warning.style.left = '-50%'

    active = true
    chosenNums = {}

    for (let innerCell of document.querySelectorAll('.inner_cell')) {
        innerCell.classList.add('hidden')

        setTimeout(() => {
            innerCell.innerHTML = randInt(1, 36)
        }, 500);
    }

    ball.style.transform = 'translate(0, 0)'
}

document.querySelector('.auto').onclick = () => {
    if (!active) { return }

    autoOptionCont.style.bottom = autoOptionCont.style.bottom == '15%' ? '-60%' : '15%'
}

function rotate() {
    return new Promise(resolve => {
        let aim = randInt(70, 120)
        let step = 0
        let rotateInterval = setInterval(() => {
            let i = step >= 36 ? step - Math.floor(step / 36) * 36 : step

            ball.style.transform = 'translate(' + coordinates[i][0] + '%, ' + coordinates[i][1] + '%)'
            step++

            if (step == aim) {
                clearInterval(rotateInterval)
                resolve(coordinates[i][2])
            }
        }, 50);
    })
}

function gameOver(win) {
    if (win) {
        let reward = Math.round(Number(betAmount.innerHTML) * 30)
        warning.querySelector('.reward').innerHTML = reward
        changeBalance(reward)
    } else {
        warning.querySelector('.reward').innerHTML = 0
    }

    warning.style.left = '50%'
}

function updateLast() {
    for (let i = 0; i < 6; i++) {
        let num = lastNumbers[i] ?? ''
        document.querySelectorAll('.last')[i].innerHTML = num
    }
}