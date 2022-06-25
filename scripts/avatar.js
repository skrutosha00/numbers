if (!localStorage.getItem('balance_r2')) {
    localStorage.setItem('balance_r2', 5000)
}

if (!localStorage.getItem('avatar_r2')) {
    localStorage.setItem('avatar_r2', 1)
}

let input = document.querySelector('input')

for (let i = 0; i < 4; i++) {
    let avatarPic = document.createElement('img')
    avatarPic.classList.add('avatar', 'block')
    avatarPic.src = '../png/avatar_' + (i + 1) + '.png'

    if (localStorage.getItem('avatar_r2') == i + 1) {
        avatarPic.classList.add('chosen')
    }

    avatarPic.onclick = () => {
        for (let av of document.querySelectorAll('.avatar')) {
            av.classList.remove('chosen')
        }

        avatarPic.classList.add('chosen')
        localStorage.setItem('avatar_r2', i + 1)
    }

    document.querySelector('.avatar_cont').appendChild(avatarPic)
}

input.value = localStorage.getItem('name_r2') ?? ''

input.onblur = () => {
    localStorage.setItem('name_r2', input.value)
}