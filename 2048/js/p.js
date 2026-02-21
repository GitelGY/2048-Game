const button = document.getElementById('btnC');

const handleMouseOver = () => {
    button.textContent = 'How to play: use arrowkey to move the tiles. when the tiles with the same number touch they marge into one!';
};

const handleMouseOut = () => {
    button.textContent = 'instructions';
};

button.addEventListener('mouseover', handleMouseOver);
button.addEventListener('mouseout', handleMouseOut);
let username = document.getElementById('username');
let password = document.getElementById('password');
username.onkeypress = function () {
    if ((event.keyCode < 97 || event.keyCode > 122) && (event.keyCode < 1448 || event.keyCode > 1514) && (event.keyCode < 65 || event.keyCode > 90))
        event.preventDefault()
    if (username.value.length == 25)
        event.preventDefault()
}

password.onkeypress = function () {
    if (event.keyCode < 49 || event.keyCode > 57)
        event.preventDefault()
    if (password.value.length == 5)
        event.preventDefault()
}


let btnA = document.getElementById('btnA');
btnA.onclick = function () {
    let popup = document.getElementById('popup');
    popup.style.display = "block";
}


let newUser = {
    username: "",
    password: "",
}
let of = document.getElementById("of");
input = document.getElementById("div");
let flag = false;
let index;
of.onclick = () => {
    let i = 0;
    const listObjects = localStorage.getItem("users")
    let userArr = JSON.parse(listObjects) || []
    if (userArr.length > 0) {
        for (i = 0; i < userArr.length && !flag; i++) {
            if (userArr[i].username == username.value) {
                flag = true;
                index = i;
            }

            const perIndex = localStorage.setItem("pi", index);

           
        }
    }


    if (!flag) {
        index = userArr.length;
        const perIndex = localStorage.setItem("pi", index);

        userArr.push({ ...newUser })
        userArr[userArr.length - 1].username = username.value;
        userArr[userArr.length - 1].password = password.value;
        error = document.getElementById("error")
        error.innerText = "hello  " + userArr[i].username;
    }
    const str = JSON.stringify(userArr)
    localStorage.setItem("users", str)
}

