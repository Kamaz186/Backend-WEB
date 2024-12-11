const inputEl = document.getElementsByClassName('app__controls-input')[0];
const btnEl = document.getElementsByClassName('app__controls-button')[0];
const listEl = document.getElementsByClassName('app__list')[0];
let counter = 1;

function createTask(objectData) {
    const root = document.createElement('div');
    root.classList.add('app__list-item');

    if (objectData.isDone === true) {
        root.classList.add('app__list-item_done');
    }

    const input = document.createElement('input');
    input.classList.add('app__list-checkbox');
    input.type = 'checkbox';

    if (objectData.isDone === true) {
        input.checked = true;
    }

    const txt = document.createElement('p');
    txt.classList.add('app__list-item-text');
    txt.innerText = objectData.text;

    input.addEventListener('change', async function () {
        objectData.isDone = input.checked;
        await updateTask(objectData);
        if (objectData.isDone) {
            txt.style.textDecoration = 'line-through';
            root.style.backgroundColor = '#EBFFED';
        } else {
            txt.style.textDecoration = 'none';
            root.style.backgroundColor = '#FFEBEB';
        }
    });

    const btn = document.createElement('button');
    btn.classList.add('app__list-btn');

    const img = document.createElement('img');
    img.src = './images/trash.svg';
    img.alt = 'trash';

    btn.addEventListener('click', async function () {
        await deleteTask(objectData.id);
        render();
    });

    btn.appendChild(img);

    root.appendChild(input);
    root.appendChild(txt);
    root.appendChild(btn);

    return root;
}

async function render() {
    const data = await fetchData();
    listEl.innerHTML = '';
    for (let item of data) {
        const tmpElement = createTask(item);
        listEl.appendChild(tmpElement);
    }
}

async function fetchData() {
    const response = await fetch('/tasks');
    const data = await response.json();
    return data;
}

btnEl.addEventListener('click', async () => {
    const textValue = inputEl.value;
    const newTask = {
        text: textValue,
        isDone: false
    };
    await createNewTask(newTask);
    inputEl.value = '';
    render();
});

async function createNewTask(task) {
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    const result = await response.json();
    console.log(result);
}

async function updateTask(task) {
    const response = await fetch('/tasks', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    const result = await response.json();
    console.log(result);
}

async function deleteTask(id) {
    await fetch('/tasks', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });
}

render();
