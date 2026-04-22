window.onload = () => {
    const socket = io();

    const form = document.getElementById('form')
    const input = document.getElementById('input')

    form.addEventListener('submit', (event) => {
        //prevents default action from happening (page refresh)
        event.preventDefault

        //emit sends piece of data to server
        //1st param: name of event (cant be connect/disconnect), 2nd: data being sent
        socket.emit('message', input.value)


        input.value = '' //removes input text after submission
    })

    socket.on('server sent data', (dataFromServer) => {
        const item = document.createElement('p')
        item.textContent = dataFromServer
        const messages = document.getElementById('all-messages')
        messages.appendChild(item);
    })
}