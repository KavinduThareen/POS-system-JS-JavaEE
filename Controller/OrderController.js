

document.addEventListener('DOMContentLoaded', function () {
    refresh();
});

document.querySelector('.orderManageBtn').addEventListener('click', function () {
    refresh();
});

let getItems = [];

function refresh() {
    document.querySelector('#OrderManage .orderDate').value = new Date().toISOString().split('T')[0];
    generateOrderId();
    loadCustomer();
    loadItems();
}

function generateOrderId() {
    fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=lastOrderId')
        .then(response => response.json())
        .then(data => {
            let lastOrderId = data.lastOrderId || 'O000';
            let newOrderId = incrementOrderId(lastOrderId);
            document.querySelector('#OrderManage .orderId').value = newOrderId;
        })
        .catch(error => console.error('Error generating order ID:', error));
}

function incrementOrderId(lastOrderId) {
    let numericPart = parseInt(lastOrderId.slice(1)) + 1;
    return 'O' + numericPart.toString().padStart(3, '0');
}

function loadCustomer() {
    let cmb = document.querySelector('#OrderManage .customers');
    cmb.innerHTML = '';

    fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=customer')
        .then(response => response.json())
        .then(customers => {
            let defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select Customer';
            cmb.appendChild(defaultOption);

            customers.forEach(customer => {
                let option = document.createElement('option');
                option.value = customer.id;
                option.text = customer.name;
                cmb.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading customers:', error));
}

function loadItems() {
    let cmb = document.querySelector('#OrderManage .itemCmb');
    cmb.innerHTML = '';

    fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=item')
        .then(response => response.json())
        .then(items => {
            let defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select Item';
            cmb.appendChild(defaultOption);

            items.forEach(item => {
                let option = document.createElement('option');
                option.value = item.code;
                option.text = item.name;
                cmb.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading items:', error));
}

document.querySelector('#OrderManage .customers').addEventListener('change', function () {
    let customerId = this.value;

    fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=customer')
        .then(response => response.json())
        .then(customers => {
            let customer = customers.find(c => c.id === customerId);
            if (customer) {
                document.querySelector('#OrderManage .custId').value = customer.id;
                document.querySelector('#OrderManage .custName').value = customer.name;
                document.querySelector('#OrderManage .custAddress').value = customer.address;
                document.querySelector('#OrderManage .custSalary').value = customer.salary;
            }
        })
        .catch(error => console.error('Error loading customer details:', error));
});

document.querySelector('#OrderManage .itemCmb').addEventListener('change', function () {
    let itemCode = this.value;

    fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=item')
        .then(response => response.json())
        .then(items => {
            let item = items.find(i => i.code === itemCode);
            if (item) {
                document.querySelector('#OrderManage .itemCode').value = item.code;
                document.querySelector('#OrderManage .itemName').value = item.name;
                document.querySelector('#OrderManage .itemPrice').value = item.price;
                document.querySelector('#OrderManage .itemQty').value = item.qty;
            }
        })
        .catch(error => console.error('Error loading item details:', error));
});

document.querySelector('#OrderManage .addBtn').addEventListener('click', function () {
    let itemCode = document.querySelector('#OrderManage .itemCode').value;
    let itemName = document.querySelector('#OrderManage .itemName').value;
    let itemPrice = parseFloat(document.querySelector('#OrderManage .itemPrice').value);
    let orderQty = parseInt(document.querySelector('#OrderManage .orderQty').value);

    if (itemCode && itemName && itemPrice && orderQty > 0) {
        let total = itemPrice * orderQty;

        let getItem = {
            itemCode: itemCode,
            itemName: itemName,
            itemPrice: itemPrice,
            orderQty: orderQty,
            total: total
        };

        getItems.push(getItem);
        clearInputFields();
        loadTable();
        
    } else {
        alert('Please select an item and enter a valid quantity.');
    }
});

function loadTable() {
    let tableRows = document.querySelector('.mainTable .tableRows');
    tableRows.innerHTML = '';

    getItems.forEach(item => {
        let row = `
            <div>
                <div>${item.itemCode}</div>
                <div>${item.itemName}</div>
                <div>${item.itemPrice.toFixed(2)}</div>
                <div>${item.orderQty}</div>
                <div>${item.total.toFixed(2)}</div>
            </div>
        `;
        tableRows.innerHTML += row;
    });

    setTotal();
}

function setTotal() {
    let total = getItems.reduce((sum, item) => sum + item.total, 0);
    document.querySelector('.Total').textContent = total.toFixed(2);
}

function clearInputFields() {
    document.querySelector('#OrderManage .itemCmb').value = '';
    document.querySelector('#OrderManage .itemCode').value = '';
    document.querySelector('#OrderManage .itemName').value = '';
    document.querySelector('#OrderManage .itemPrice').value = '';
    document.querySelector('#OrderManage .itemQty').value = '';
    document.querySelector('#OrderManage .orderQty').value = '';
}



document.querySelector('.placeOrder').addEventListener('click', function () {
 

    let total = getItems.reduce((sum, item) => sum + item.total, 0);
    let discount = parseFloat(document.querySelector('#OrderManage .Discount').value) || 0;
    let cash = parseFloat(document.querySelector('#OrderManage .Cash').value) || 0;
    
   
    if (discount < 0 || discount > 100) {
        alert('Invalid discount value. It should be between 0 and 100.');
        return; 
    }

    
    let subTotal = total - (total * discount / 100);
    
    if (cash < subTotal) {
        alert('Insufficient cash. Please provide more cash.');
        return; 
    }

    let balance = cash - subTotal;

  
    document.querySelector('#OrderManage .SubTotal').textContent = subTotal.toFixed(2);
    document.querySelector('#OrderManage .Balance').value = balance.toFixed(2);


});










































































// document.addEventListener('DOMContentLoaded', function () {
//     refresh();
// });

// document.querySelector('.orderManageBtn').addEventListener('click', function () {
//     refresh();
// });

// let getItems = [];

// function refresh() {
//     document.querySelector('#OrderManage .orderDate').value = new Date().toISOString().split('T')[0];
//     generateOrderId();
//     loadCustomer();
//     loadItems();
// }

// function generateOrderId() {
//     fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=lastOrderId')
//         .then(response => response.json())
//         .then(data => {
//             let lastOrderId = data.lastOrderId || 'O000';
//             let newOrderId = incrementOrderId(lastOrderId);
//             document.querySelector('#OrderManage .orderId').value = newOrderId;
//         })
//         .catch(error => console.error('Error generating order ID:', error));
// }

// function incrementOrderId(lastOrderId) {
//     let numericPart = parseInt(lastOrderId.slice(1)) + 1;
//     return 'O' + numericPart.toString().padStart(3, '0');
// }

// function loadCustomer() {
//     let cmb = document.querySelector('#OrderManage .customers');
//     cmb.innerHTML = '';

//     fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=customer')
//         .then(response => response.json())
//         .then(customers => {
//             let defaultOption = document.createElement('option');
//             defaultOption.value = '';
//             defaultOption.text = 'Select Customer';
//             cmb.appendChild(defaultOption);

//             customers.forEach(customer => {
//                 let option = document.createElement('option');
//                 option.value = customer.id;
//                 option.text = customer.name;
//                 cmb.appendChild(option);
//             });
//         })
//         .catch(error => console.error('Error loading customers:', error));
// }

// function loadItems() {
//     let cmb = document.querySelector('#OrderManage .itemCmb');
//     cmb.innerHTML = '';

//     fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=item')
//         .then(response => response.json())
//         .then(items => {
//             let defaultOption = document.createElement('option');
//             defaultOption.value = '';
//             defaultOption.text = 'Select Item';
//             cmb.appendChild(defaultOption);

//             items.forEach(item => {
//                 let option = document.createElement('option');
//                 option.value = item.code;
//                 option.text = item.name;
//                 cmb.appendChild(option);
//             });
//         })
//         .catch(error => console.error('Error loading items:', error));
// }

// document.querySelector('#OrderManage .customers').addEventListener('change', function () {
//     let customerId = this.value;

//     fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=customer')
//         .then(response => response.json())
//         .then(customers => {
//             let customer = customers.find(c => c.id === customerId);
//             if (customer) {
//                 document.querySelector('#OrderManage .custId').value = customer.id;
//                 document.querySelector('#OrderManage .custName').value = customer.name;
//                 document.querySelector('#OrderManage .custAddress').value = customer.address;
//                 document.querySelector('#OrderManage .custSalary').value = customer.salary;
//             }
//         })
//         .catch(error => console.error('Error loading customer details:', error));
// });

// document.querySelector('#OrderManage .itemCmb').addEventListener('change', function () {
//     let itemCode = this.value;

//     fetch('http://localhost:8080/pos_system_backend_war_exploded/order?type=item')
//         .then(response => response.json())
//         .then(items => {
//             let item = items.find(i => i.code === itemCode);
//             if (item) {
//                 document.querySelector('#OrderManage .itemCode').value = item.code;
//                 document.querySelector('#OrderManage .itemName').value = item.name;
//                 document.querySelector('#OrderManage .itemPrice').value = item.price;
//                 document.querySelector('#OrderManage .itemQty').value = item.qty;
//             }
//         })
//         .catch(error => console.error('Error loading item details:', error));
// });

// document.querySelector('#OrderManage .addBtn').addEventListener('click', function () {
//     let itemCode = document.querySelector('#OrderManage .itemCode').value;
//     let itemName = document.querySelector('#OrderManage .itemName').value;
//     let itemPrice = parseFloat(document.querySelector('#OrderManage .itemPrice').value);
//     let orderQty = parseInt(document.querySelector('#OrderManage .orderQty').value);

//     if (itemCode && itemName && itemPrice && orderQty > 0) {
//         let total = itemPrice * orderQty;

//         let getItem = {
//             itemCode: itemCode,
//             itemName: itemName,
//             itemPrice: itemPrice,
//             orderQty: orderQty,
//             total: total
//         };

//         getItems.push(getItem);
//         clearInputFields();
//         loadTable();
        
//     } else {
//         alert('Please select an item and enter a valid quantity.');
//     }
// });

// function loadTable() {
//     let tableRows = document.querySelector('.mainTable .tableRows');
//     tableRows.innerHTML = '';

//     getItems.forEach(item => {
//         let row = `
//             <div>
//                 <div>${item.itemCode}</div>
//                 <div>${item.itemName}</div>
//                 <div>${item.itemPrice.toFixed(2)}</div>
//                 <div>${item.orderQty}</div>
//                 <div>${item.total.toFixed(2)}</div>
//             </div>
//         `;
//         tableRows.innerHTML += row;
//     });

//     setTotal();
// }

// function setTotal() {
//     let total = getItems.reduce((sum, item) => sum + item.total, 0);
//     document.querySelector('.Total').textContent = total.toFixed(2);

//     updateSubTotal(); 
// }

// function updateSubTotal() {
//     let total = parseFloat(document.querySelector('.Total').textContent);
//     let discount = parseFloat(document.querySelector('.Discount').value) || 0;
//     let subTotal = total - discount;
//     document.querySelector('.SubTotal').textContent = subTotal.toFixed(2);

//     updateBalance(); 
// }

// function updateBalance() {
//     let subTotal = parseFloat(document.querySelector('.SubTotal').textContent);
//     let cash = parseFloat(document.querySelector('.Cash').value) || 0;
//     let balance = cash - subTotal;
//     document.querySelector('.Balance').value = balance.toFixed(2);
// }

// function clearInputFields() {
//     document.querySelector('#OrderManage .itemCmb').value = '';
//     document.querySelector('#OrderManage .itemCode').value = '';
//     document.querySelector('#OrderManage .itemName').value = '';
//     document.querySelector('#OrderManage .itemPrice').value = '';
//     document.querySelector('#OrderManage .itemQty').value = '';
//     document.querySelector('#OrderManage .orderQty').value = '';
// }


// document.querySelector('.Cash').addEventListener('input', updateBalance);
// document.querySelector('.Discount').addEventListener('input', updateSubTotal);





















































// function loadItems() {
//     let cmb = document.querySelector('#OrderManage .itemCmb');
//     cmb.innerHTML = '';
//     let option = [''];
//     let items = getAllItems();

//     items.forEach(item => {
//         option.push(item.itemId);
//     });

//     option.forEach(value => {
//         let optionElement = document.createElement('option');
//         optionElement.value = value;
//         optionElement.text = value;
//         cmb.appendChild(optionElement);
//     });
// }

// document.querySelector('#OrderManage .itemCmb').addEventListener('change', function () {
//     let item = getAllItems().find(i => i.itemId === this.value);
//     itemId = item.itemId;
//     itemQty = item.itemQty;
//     orderQty = parseInt(document.querySelector('#OrderManage .orderQty').value, 10);
//     document.querySelector('#OrderManage .addBtn').textContent = 'Add';
//     document.querySelector('#OrderManage .itemCode').value = item.itemId;
//     document.querySelector('#OrderManage .itemName').value = item.itemName;
//     document.querySelector('#OrderManage .itemQty').value = item.itemQty;
//     document.querySelector('#OrderManage .itemPrice').value = item.itemPrice;
// });



// let getItems = [];

// function clear(tableCount) {
//     if (tableCount === 1) {
//         document.querySelector('#OrderManage .itemCode').value = '';
//         document.querySelector('#OrderManage .itemName').value = '';
//         document.querySelector('#OrderManage .itemPrice').value = '';
//         document.querySelector('#OrderManage .itemQty').value = '';
//         document.querySelector('#OrderManage .orderQty').value = '';
//         document.querySelector('#OrderManage .SubTotal').textContent = '';
//         document.querySelector('#OrderManage .Cash').value = '';
//         document.querySelector('#OrderManage .Total').textContent = '';
//         document.querySelector('#OrderManage .Discount').value = '';
//         document.querySelector('#OrderManage .itemCmb').value = '';
//     } else {
//         document.querySelector('#OrderManage .custId').value = '';
//         document.querySelector('#OrderManage .custName').value = '';
//         document.querySelector('#OrderManage .custAddress').value = '';
//         document.querySelector('#OrderManage .custSalary').value = '';
//         document.querySelector('#OrderManage .itemCode').value = '';
//         document.querySelector('#OrderManage .itemName').value = '';
//         document.querySelector('#OrderManage .itemPrice').value = '';
//         document.querySelector('#OrderManage .itemQty').value = '';
//         document.querySelector('#OrderManage .orderQty').value = '';
//     }
// }

// document.querySelector('#OrderManage .addBtn').addEventListener('click', function () {

//     if (document.querySelector('#OrderManage .addBtn').textContent === 'delete') {
//         dropItem();
//     } else {
//         let getItem = {
//             itemCode: document.querySelector('#OrderManage .itemCode').value,
//             getItems: document.querySelector('#OrderManage .itemName').value,
//             itemPrice: parseFloat(document.querySelector('#OrderManage .itemPrice').value),
//             itemQty: parseInt(document.querySelector('#OrderManage .orderQty').value, 10),
//             total: parseFloat(document.querySelector('#OrderManage .itemPrice').value) * parseInt(document.querySelector('#OrderManage .orderQty').value, 10)
//         };

//         let itemQty = parseInt(document.querySelector('#OrderManage .itemQty').value, 10);
//         let orderQty = parseInt(document.querySelector('#OrderManage .orderQty').value, 10);

//         if (itemQty >= orderQty) {
//             if (document.querySelector('#OrderManage .custId').value !== '' && document.querySelector('#OrderManage .custName').value !== null) {
//                 if (orderQty > 0) {
//                     let item = getItems.find(I => I.itemCode === getItem.itemCode);
//                     if (item == null) {
//                         getItems.push(getItem);
//                         loadTable();
//                         clear(1);
//                         setTotal();
//                     } else {
//                         alert('Already Added');
//                     }
//                 } else {
//                     alert('Invalid Quantity');
//                 }
//             } else {
//                 alert('Invalid Customer');
//             }
//         } else {
//             alert('Not Enough Quantity');
//         }
//     }
// });

// function loadTable() {
//     let tableRows = document.querySelector('#OrderManage .tableRows');
//     tableRows.innerHTML = '';
//     for (let i = 0; i < getItems.length; i++) {
//         tableRows.innerHTML += `
//             <div>
//                 <div>${getItems[i].itemCode}</div>
//                 <div>${getItems[i].getItems}</div>
//                 <div>${getItems[i].itemPrice}</div>
//                 <div>${getItems[i].itemQty}</div>
//                 <div>${getItems[i].total}</div>
//             </div>`;
//     }
// }

// function setTotal() {
//     let total = 0;
//     for (let i = 0; i < getItems.length; i++) {
//         total += getItems[i].total;
//     }
//     document.querySelector('#OrderManage .Total').textContent = total;
// }

// document.querySelector('#OrderManage .placeOrder').addEventListener('click', function () {
//     let cash = parseFloat(document.querySelector('#OrderManage .Cash').value);
//     let total = parseFloat(document.querySelector('#OrderManage .Total').textContent);
//     let discount = parseFloat(document.querySelector('#OrderManage .Discount').value);

//     if (cash >= total) {
//         if (discount >= 0 && discount <= 100) {
//             let subTotal = total - (total * discount / 100);
//             document.querySelector('#OrderManage .SubTotal').textContent = subTotal.toFixed(2);
//             let balance = cash - subTotal;
//             document.querySelector('#OrderManage .Balance').value = balance.toFixed(2);

//             let Order = {
//                 orderId: document.querySelector('#OrderManage .orderId').value,
//                 orderDate: document.querySelector('#OrderManage .orderDate').value,
//                 custId: document.querySelector('#OrderManage .custId').value,
//                 items: getItems,
//                 total: total,
//                 discount: discount,
//                 subTotal: subTotal,
//                 cash: cash,
//                 balance: balance
//             }

//             saveOrder(Order);
//             updateItemData();

//             getItems = [];
//             loadTable();
//             clear(2);
//             refresh();
//         } else {
//             alert('Invalid Discount');
//         }
//     } else {
//         alert('Not Enough Cash');
//     }
// });

// function updateItemData() {
//     let items = getAllItems();
//     for (let i = 0; i < getItems.length; i++) {
//         let item = items.find(I => I.itemId === getItems[i].itemCode);
//         item.itemQty -= getItems[i].itemQty;
//         let index = items.findIndex(I => I.itemId === getItems[i].itemCode);
//         updateItem(index, item);
//     }
// }

// document.querySelector('.mainTable .tableRows').addEventListener('click', function (event) {
//     if (event.target.tagName === 'DIV') {
//         let itemCode = event.target.children[0].textContent;
//         let itemName = event.target.children[1].textContent;
//         let price = event.target.children[2].textContent;
//         let qty = event.target.children[3].textContent;

//         document.querySelector('#OrderManage .itemCode').value = itemCode;
//         document.querySelector('#OrderManage .itemName').value = itemName;
//         document.querySelector('#OrderManage .itemPrice').value = price;
//         document.querySelector('#OrderManage .orderQty').value = qty;

//         document.querySelector('#OrderManage .ItemSelect .addBtn').textContent = 'delete';
//     }
// });

// function dropItem() {
//     let itemCode = document.querySelector('#OrderManage .itemCode').value;
//     let item = getItems.find(I => I.itemCode === itemCode);
//     let index = getItems.findIndex(I => I.itemCode === itemCode);
//     getItems.splice(index, 1);
//     loadTable();
//     clear(1);
//     setTotal();
// }
