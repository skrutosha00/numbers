import { setBalanceField } from './functions.js'

if (!localStorage.getItem('name_r2')) {
    localStorage.setItem('name_r2', 'Player')
}

setBalanceField()

document.querySelector('.avatar_cont img').src = '../png/avatar_' + localStorage.getItem('avatar_r2') + '.png'
document.querySelector('.name').innerHTML = localStorage.getItem('name_r2')