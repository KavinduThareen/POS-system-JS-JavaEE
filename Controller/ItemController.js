



// save


let currentItemCode = parseInt(localStorage.getItem('itemID')) || 1; // Initialize counter with stored value or 1

function generateItemId() {
    let itemIdField = document.querySelector('#ItemManage .itemId');
    let randomId = Math.floor(100 + Math.random() * 900);
    let nextItemCode = 'I-' + randomId;
    itemIdField.value = nextItemCode;
    localStorage.setItem('itemID', randomId);
    return nextItemCode;
}

document.addEventListener('DOMContentLoaded', function() {
    generateItemId();  
});

document.querySelector('#ItemManage #ItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
});

document.querySelector('#ItemManage .updateBtn').addEventListener('click', function() {
    updateItem();
});

let itemCode;
let itemName;
let itemQty;
let itemPrice;

document.querySelector('#ItemManage .saveBtn').addEventListener('click', function() {
    itemCode = generateItemId();
    itemName = document.querySelector('#ItemManage .itemName').value;
    itemQty = document.querySelector('#ItemManage .itemQty').value;
    itemPrice = document.querySelector('#ItemManage .itemPrice').value;

    let item = {
        code: itemCode,
        name: itemName,
        qty: itemQty,
        price: itemPrice
    };

    const itemJSON = JSON.stringify(item);
    console.log("Sending data:", itemJSON);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            console.log("Response text:", http.responseText); 
            if (http.status == 201) {
                try {
                    let responseJSON = JSON.parse(http.responseText);
                    console.log("Response from server:", responseJSON);
                    alert(responseJSON.message);
                } catch (e) {
                    console.error("Failed to parse JSON response:", e);
                    console.error("Response text:", http.responseText);
                }
                refresh();
                fetchAndUpdateTable();
            } else {
                console.error("Failed to save item");
                console.error("Status:", http.status);
                console.error("Response:", http.responseText);
            }
        }
    };
    http.open("POST", "http://localhost:8080/pos_system_backend_war_exploded/item", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(itemJSON);
});









// validation


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








//  load table

document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://localhost:8080/pos_system_backend_war_exploded/item';
    const tableBody = document.querySelector('.itemtableRow');

    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    function fetchAndUpdateTable() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('items Data:', data);

                tableBody.innerHTML = ''; // Clear existing rows

                data.forEach(items => {
                    const row = document.createElement('tr');
                    
                    const codeCell = document.createElement('td');
                    codeCell.textContent = items.code;
                    row.appendChild(codeCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = items.name;
                    row.appendChild(nameCell);

                    const qtyCell = document.createElement('td');
                    qtyCell.textContent = items.qty;
                    row.appendChild(qtyCell);

                    const priceCell = document.createElement('td');
                    priceCell.textContent = items.price;
                    row.appendChild(priceCell);

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Initial data load
    fetchAndUpdateTable();

    // Set up live refresh every 30 seconds (1000 milliseconds)
    setInterval(fetchAndUpdateTable, 1000);
});






// item update 
 
function updateItem() {
    let itemCode = document.querySelector('#ItemManage .itemId').value;
    let itemName = document.querySelector('#ItemManage .itemName').value;
    let itemQty = document.querySelector('#ItemManage .itemQty').value;
    let itemPrice = document.querySelector('#ItemManage .itemPrice').value;

    // Validate input before sending
    if (!itemCode) {
        alert('Item Code is required for update');
        return;
    }

    let item = {
        code: itemCode,
        name: itemName,
        qty: itemQty,
        price: itemPrice
    }

    const itemJSON = JSON.stringify(item);
    console.log("Sending data:", itemJSON);

    fetch(`http://localhost:8080/pos_system_backend_war_exploded/item?code=${itemCode}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: itemJSON,
    })
    .then(response => {
        if (response.ok) {
            // Check if response body is empty
            if (response.status === 204) {
                return { message: 'Item updated successfully' };
            }
            // If response body is not empty, parse JSON
            return response.json();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        // Data might be an object with a message or simply a success message
        console.log("Response from server:", data);
        if (data && data.message) {
            alert(data.message);
        } else {
            // alert('Item updated successfully');
        }
        refresh();
        fetchAndUpdateTable(); 
    })
    .catch(error => {
        // console.error('Error:', error);
        // alert('An error occurred while updating the item.');
    });
}






// item delet 

document.querySelector('#ItemManage .deleteBtn').addEventListener('click', async function() {
    let itemCode = document.querySelector('#ItemManage .itemId').value;

    if (!itemCode) {
        alert('Please enter a item code');
        return;
    }

    try {
        let response = await fetch(`http://localhost:8080/pos_system_backend_war_exploded/item?code=${itemCode}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            if (response.status !== 204) { 
                let result = await response.json();
                alert(result.message);
            } else {
                alert("item deleted successfully");
            }
            refresh(); 
        } else {
            let error = await response.json();
            alert(error.message);
        }
    } catch (error) {
       
    }
});





function refresh() {
    console.log("Refresh function called");

    // document.querySelector('#ItemManage .itemId').value = '';
    document.querySelector('#ItemManage .itemName').value = '';
    document.querySelector('#ItemManage .itemQty').value = '';
    document.querySelector('#ItemManage .itemPrice').value = '';
    // loadTable();
}



document.querySelector('#ItemManage .itemtableRow').addEventListener('click', function(event) {
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





document.querySelector('#ItemManage .clearBtn').addEventListener('click', function() {
    refresh();
});



// get all

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
