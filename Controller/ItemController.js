import { saveItem, getAllItems, deleteItem, updateItem } from '../model/ItemModel.js';

document.querySelector('#ItemManage #ItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
});

document.addEventListener('DOMContentLoaded', function() {
    refresh();
});

let itemId;
let itemName;
let itemQty;
let itemPrice;

document.querySelector('#ItemManage .saveBtn').addEventListener('click', function() {
    itemId = document.querySelector('#ItemManage .itemId').value;
    itemName = document.querySelector('#ItemManage .itemName').value;
    itemQty = document.querySelector('#ItemManage .itemQty').value;
    itemPrice = document.querySelector('#ItemManage .itemPrice').value;

    let item = {
        itemId: itemId,
        itemName: itemName,
        itemQty: itemQty,
        itemPrice: itemPrice
    }

    if (validate(item)) {
        saveItem(item);
        refresh();
    }
});

function validate(item) {
    let valid = true;

    if ((/^I0[0-9]+$/).test(item.itemId)) {
        document.querySelector('#ItemManage .invalidCode').textContent = '';
        valid = true;
    } else {
        document.querySelector('#ItemManage .invalidCode').textContent = 'Invalid Item Id';
        valid = false;
    }

    if ((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(item.itemName)) {
        document.querySelector('#ItemManage .invalidName').textContent = '';
    } else {
        document.querySelector('#ItemManage .invalidName').textContent = 'Invalid Item Name';
        valid = false;
    }

    if (item.itemQty != null && item.itemQty > 0) {
        document.querySelector('#ItemManage .invalidQty').textContent = '';
    } else {
        document.querySelector('#ItemManage .invalidQty').textContent = 'Invalid Item Quantity';
        valid = false;
    }

    if (item.itemPrice != null && item.itemPrice > 0) {
        document.querySelector('#ItemManage .invalidPrice').textContent = '';
    } else {
        document.querySelector('#ItemManage .invalidPrice').textContent = 'Invalid Item Price';
        valid = false;
    }

    let items = getAllItems();

    for (let i = 0; i < items.length; i++) {
        if (items[i].itemId === item.itemId) {
            document.querySelector('#ItemManage .invalidCode').textContent = 'Item Id already exists';
            valid = false;
            return valid;
        }
    }

    return valid;
}

function extractNumber(id) {
    var match = id.match(/I0(\d+)/);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

function refresh() {
    document.querySelector('#ItemManage .itemId').value = generateId();
    document.querySelector('#ItemManage .itemName').value = '';
    document.querySelector('#ItemManage .itemQty').value = '';
    document.querySelector('#ItemManage .itemPrice').value = '';
    loadTable();
}

function generateId() {
    let items = getAllItems();

    if (!items || items.length == 0) {
        return 'I01';
    } else {
        let lastItem = items[items.length - 1];
        let number = extractNumber(lastItem.itemId);
        number++;
        return 'I0' + number;
    }
}

function loadTable() {
    let items = getAllItems();
    let tableRow = document.querySelector('#ItemManage .tableRow');
    tableRow.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${items[i].itemId}</td>
            <td>${items[i].itemName}</td>
            <td>${items[i].itemQty}</td>
            <td>${items[i].itemPrice}</td>
        `;
        tableRow.appendChild(newRow);
    }
}

document.querySelector('#ItemManage .tableRow').addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName === 'TD') {
        let row = target.parentNode;
        let id = row.children[0].textContent;
        let name = row.children[1].textContent;
        let qty = row.children[2].textContent;
        let price = row.children[3].textContent;
        document.querySelector('#ItemManage .itemId').value = id;
        document.querySelector('#ItemManage .itemName').value = name;
        document.querySelector('#ItemManage .itemQty').value = qty;
        document.querySelector('#ItemManage .itemPrice').value = price;
    }
});

document.querySelector('#ItemManage .deleteBtn').addEventListener('click', function() {
    let id = document.querySelector('#ItemManage .itemId').value;
    let items = getAllItems();
    let index = items.findIndex(item => item.itemId === id);
    if (index >= 0) {
        deleteItem(index);
        refresh();
    } else {
        document.querySelector('#ItemManage .invalidCode').textContent = 'Item Id does not exist';
    }
});

document.querySelector('#ItemManage .updateBtn').addEventListener('click', function() {
    let item = {
        itemId: 'I00',
        itemName: document.querySelector('#ItemManage .itemName').value,
        itemQty: document.querySelector('#ItemManage .itemQty').value,
        itemPrice: document.querySelector('#ItemManage .itemPrice').value
    }

    let valid = validate(item);

    item.itemId = document.querySelector('#ItemManage .itemId').value;

    if (valid) {
        let items = getAllItems();
        let index = items.findIndex(i => i.itemId === item.itemId);
        updateItem(index, item);
        refresh();
    }
});

document.querySelector('#ItemManage .clearBtn').addEventListener('click', function() {
    refresh();
});

document.querySelector('#ItemManage .searchBtn').addEventListener('click', function() {
    let id = document.querySelector('#ItemManage .itemId').value;
    let items = getAllItems();
    let item = items.find(item => item.itemId === id);
    if (item) {
        document.querySelector('#ItemManage .itemName').value = item.itemName;
        document.querySelector('#ItemManage .itemQty').value = item.itemQty;
        document.querySelector('#ItemManage .itemPrice').value = item.itemPrice;
    } else {
        document.querySelector('#ItemManage .invalidCode').textContent = 'Item Id does not exist';
    }
});
