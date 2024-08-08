

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
                document.querySelector('#OrderManage .custSalary').value = customer.salory;
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





