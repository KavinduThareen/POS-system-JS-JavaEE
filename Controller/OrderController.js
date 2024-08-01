import { getAllOrders, saveOrder } from "../model/OrderModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { getAllItems, updateItem } from "../model/ItemModel.js";

var itemId;
var itemQty;
var orderQty;

document.addEventListener('DOMContentLoaded', function () {
    refresh();
});

document.querySelector('.orderManageBtn').addEventListener('click', function () {
    refresh();
});

function refresh() {
    document.querySelector('#OrderManage .orderId').value = generateId();
    document.querySelector('#OrderManage .orderDate').value = new Date().toISOString().split('T')[0];
    loadCustomer();
    loadItems();
}

function extractNumber(id) {
    var match = id.match(/OD(\d+)/);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

function generateId() {
    let orders = getAllOrders();

    if (orders.length === 0) {
        return 'OD01';
    } else {
        let orderId = orders[orders.length - 1].orderId;
        let number = extractNumber(orderId);
        number++;
        return 'OD0' + number;
    }
}

function loadCustomer() {
    let cmb = document.querySelector('#OrderManage .customers');
    cmb.innerHTML = '';
    let option = [''];
    let customers = getAllCustomers();
    customers.forEach(customer => {
        option.push(customer.custId);
    });

    option.forEach(value => {
        let optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.text = value;
        cmb.appendChild(optionElement);
    });
}

document.querySelector('#OrderManage .customers').addEventListener('change', function () {
    let customer = getAllCustomers().find(c => c.custId === this.value);
    document.querySelector('#OrderManage .custId').value = customer.custId;
    document.querySelector('#OrderManage .custName').value = customer.custName;
    document.querySelector('#OrderManage .custAddress').value = customer.custAddress;
    document.querySelector('#OrderManage .custSalary').value = customer.custSalary;
});

function loadItems() {
    let cmb = document.querySelector('#OrderManage .itemCmb');
    cmb.innerHTML = '';
    let option = [''];
    let items = getAllItems();

    items.forEach(item => {
        option.push(item.itemId);
    });

    option.forEach(value => {
        let optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.text = value;
        cmb.appendChild(optionElement);
    });
}

document.querySelector('#OrderManage .itemCmb').addEventListener('change', function () {
    let item = getAllItems().find(i => i.itemId === this.value);
    itemId = item.itemId;
    itemQty = item.itemQty;
    orderQty = parseInt(document.querySelector('#OrderManage .orderQty').value, 10);
    document.querySelector('#OrderManage .addBtn').textContent = 'Add';
    document.querySelector('#OrderManage .itemCode').value = item.itemId;
    document.querySelector('#OrderManage .itemName').value = item.itemName;
    document.querySelector('#OrderManage .itemQty').value = item.itemQty;
    document.querySelector('#OrderManage .itemPrice').value = item.itemPrice;
});

let getItems = [];

function clear(tableCount) {
    if (tableCount === 1) {
        document.querySelector('#OrderManage .itemCode').value = '';
        document.querySelector('#OrderManage .itemName').value = '';
        document.querySelector('#OrderManage .itemPrice').value = '';
        document.querySelector('#OrderManage .itemQty').value = '';
        document.querySelector('#OrderManage .orderQty').value = '';
        document.querySelector('#OrderManage .SubTotal').textContent = '';
        document.querySelector('#OrderManage .Cash').value = '';
        document.querySelector('#OrderManage .Total').textContent = '';
        document.querySelector('#OrderManage .Discount').value = '';
        document.querySelector('#OrderManage .itemCmb').value = '';
    } else {
        document.querySelector('#OrderManage .custId').value = '';
        document.querySelector('#OrderManage .custName').value = '';
        document.querySelector('#OrderManage .custAddress').value = '';
        document.querySelector('#OrderManage .custSalary').value = '';
        document.querySelector('#OrderManage .itemCode').value = '';
        document.querySelector('#OrderManage .itemName').value = '';
        document.querySelector('#OrderManage .itemPrice').value = '';
        document.querySelector('#OrderManage .itemQty').value = '';
        document.querySelector('#OrderManage .orderQty').value = '';
    }
}

document.querySelector('#OrderManage .addBtn').addEventListener('click', function () {

    if (document.querySelector('#OrderManage .addBtn').textContent === 'delete') {
        dropItem();
    } else {
        let getItem = {
            itemCode: document.querySelector('#OrderManage .itemCode').value,
            getItems: document.querySelector('#OrderManage .itemName').value,
            itemPrice: parseFloat(document.querySelector('#OrderManage .itemPrice').value),
            itemQty: parseInt(document.querySelector('#OrderManage .orderQty').value, 10),
            total: parseFloat(document.querySelector('#OrderManage .itemPrice').value) * parseInt(document.querySelector('#OrderManage .orderQty').value, 10)
        };

        let itemQty = parseInt(document.querySelector('#OrderManage .itemQty').value, 10);
        let orderQty = parseInt(document.querySelector('#OrderManage .orderQty').value, 10);

        if (itemQty >= orderQty) {
            if (document.querySelector('#OrderManage .custId').value !== '' && document.querySelector('#OrderManage .custName').value !== null) {
                if (orderQty > 0) {
                    let item = getItems.find(I => I.itemCode === getItem.itemCode);
                    if (item == null) {
                        getItems.push(getItem);
                        loadTable();
                        clear(1);
                        setTotal();
                    } else {
                        alert('Already Added');
                    }
                } else {
                    alert('Invalid Quantity');
                }
            } else {
                alert('Invalid Customer');
            }
        } else {
            alert('Not Enough Quantity');
        }
    }
});

function loadTable() {
    let tableRows = document.querySelector('#OrderManage .tableRows');
    tableRows.innerHTML = '';
    for (let i = 0; i < getItems.length; i++) {
        tableRows.innerHTML += `
            <div>
                <div>${getItems[i].itemCode}</div>
                <div>${getItems[i].getItems}</div>
                <div>${getItems[i].itemPrice}</div>
                <div>${getItems[i].itemQty}</div>
                <div>${getItems[i].total}</div>
            </div>`;
    }
}

function setTotal() {
    let total = 0;
    for (let i = 0; i < getItems.length; i++) {
        total += getItems[i].total;
    }
    document.querySelector('#OrderManage .Total').textContent = total;
}

document.querySelector('#OrderManage .placeOrder').addEventListener('click', function () {
    let cash = parseFloat(document.querySelector('#OrderManage .Cash').value);
    let total = parseFloat(document.querySelector('#OrderManage .Total').textContent);
    let discount = parseFloat(document.querySelector('#OrderManage .Discount').value);

    if (cash >= total) {
        if (discount >= 0 && discount <= 100) {
            let subTotal = total - (total * discount / 100);
            document.querySelector('#OrderManage .SubTotal').textContent = subTotal.toFixed(2);
            let balance = cash - subTotal;
            document.querySelector('#OrderManage .Balance').value = balance.toFixed(2);

            let Order = {
                orderId: document.querySelector('#OrderManage .orderId').value,
                orderDate: document.querySelector('#OrderManage .orderDate').value,
                custId: document.querySelector('#OrderManage .custId').value,
                items: getItems,
                total: total,
                discount: discount,
                subTotal: subTotal,
                cash: cash,
                balance: balance
            }

            saveOrder(Order);
            updateItemData();

            getItems = [];
            loadTable();
            clear(2);
            refresh();
        } else {
            alert('Invalid Discount');
        }
    } else {
        alert('Not Enough Cash');
    }
});

function updateItemData() {
    let items = getAllItems();
    for (let i = 0; i < getItems.length; i++) {
        let item = items.find(I => I.itemId === getItems[i].itemCode);
        item.itemQty -= getItems[i].itemQty;
        let index = items.findIndex(I => I.itemId === getItems[i].itemCode);
        updateItem(index, item);
    }
}

document.querySelector('.mainTable .tableRows').addEventListener('click', function (event) {
    if (event.target.tagName === 'DIV') {
        let itemCode = event.target.children[0].textContent;
        let itemName = event.target.children[1].textContent;
        let price = event.target.children[2].textContent;
        let qty = event.target.children[3].textContent;

        document.querySelector('#OrderManage .itemCode').value = itemCode;
        document.querySelector('#OrderManage .itemName').value = itemName;
        document.querySelector('#OrderManage .itemPrice').value = price;
        document.querySelector('#OrderManage .orderQty').value = qty;

        document.querySelector('#OrderManage .ItemSelect .addBtn').textContent = 'delete';
    }
});

function dropItem() {
    let itemCode = document.querySelector('#OrderManage .itemCode').value;
    let item = getItems.find(I => I.itemCode === itemCode);
    let index = getItems.findIndex(I => I.itemCode === itemCode);
    getItems.splice(index, 1);
    loadTable();
    clear(1);
    setTotal();
}
