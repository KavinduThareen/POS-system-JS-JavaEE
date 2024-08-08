

// save


let lastCustomerId = parseInt(localStorage.getItem('lastCustomerId')) || 0;

document.addEventListener('DOMContentLoaded', function() {
    
    generateCustomerId();
});

document.querySelector('#CustomerManage #customerForm').addEventListener('submit', function(event) {
    event.preventDefault();
});

document.querySelector('#CustomerManage .updateBtn').addEventListener('click', function() {
    updateCustomer();
});

document.querySelector('#CustomerManage .saveBtn').addEventListener('click', function() {
    
    generateCustomerId();

    let custId = document.querySelector('#CustomerManage .custId').value;
    let custName = document.querySelector('#CustomerManage .custName').value;
    let custAddress = document.querySelector('#CustomerManage .custAddress').value;
    let custSalary = document.querySelector('#CustomerManage .custSalary').value;

    let customer = {
        id: custId,
        name: custName,
        address: custAddress,
        salory: custSalary 
    };

    const customerJSON = JSON.stringify(customer);
    console.log("Sending data:", customerJSON);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            console.log("Response text:", http.responseText); 
            if (http.status == 201) {
                try {
                    var responseJSON = JSON.parse(http.responseText);
                    console.log("Response from server:", responseJSON);
                    alert(responseJSON.message);
                } catch (e) {
                    console.error("Failed to parse JSON response:", e);
                    console.error("Response text:", http.responseText);
                }
               
                refresh();
         
            } else {
                console.error("Failed to save customer");
                console.error("Status:", http.status);
                console.error("Response:", http.responseText);
            }
        }
    };

    http.open("POST", "http://localhost:8080/pos_system_backend_war_exploded/customer", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(customerJSON);
});


function generateCustomerId() {
    let customerIdField = document.querySelector('#CustomerManage .custId');
    let randomId = Math.floor(100 + Math.random() * 900);
    let newId = 'C-' + randomId;
    customerIdField.value = newId;
}








function refresh() {
    console.log("Refresh function called");
 
    // document.querySelector('#CustomerManage .custId').value = '';
    document.querySelector('#CustomerManage .custName').value = '';
    document.querySelector('#CustomerManage .custAddress').value = '';
    document.querySelector('#CustomerManage .custSalary').value = '';
}





// validation


function validate(customer) {
    let valid = true;

    if ((/^C0[0-9]+$/).test(customer.custId)) {
        document.querySelector('#CustomerManage .invalidCustId').textContent = '';
        valid = true;
    } else {
        document.querySelector('#CustomerManage .invalidCustId').textContent = 'Invalid Customer Id';
        valid = false;
    }

    if ((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(customer.custName)) {
        document.querySelector('#CustomerManage .invalidCustName').textContent = '';
    } else {
        document.querySelector('#CustomerManage .invalidCustName').textContent = 'Invalid Customer Name';
        valid = false;
    }

    if ((/^[A-Z][a-z, ]+$/).test(customer.custAddress)) {
        document.querySelector('#CustomerManage .invalidCustAddress').textContent = '';
    } else {
        document.querySelector('#CustomerManage .invalidCustAddress').textContent = 'Invalid Customer Address';
        valid = false;
    }

    if (customer.custSalary != null && customer.custSalary > 0) {
        document.querySelector('#CustomerManage .invalidCustSalary').textContent = '';
    } else {
        document.querySelector('#CustomerManage .invalidCustSalary').textContent = 'Invalid Customer Salary';
        valid = false;
    }

    let customers = getAllCustomers();
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].custId === customer.custId) {
            document.querySelector('#CustomerManage .invalidCustId').textContent = 'Customer Id Already Exists';
            valid = false;
        }
    }

    return valid;
}




// load table

document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://localhost:8080/pos_system_backend_war_exploded/customer';
    const tableBody = document.querySelector('.tableRow');

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
                console.log('Customer Data:', data);

                tableBody.innerHTML = ''; // Clear existing rows

                data.forEach(customer => {
                    const row = document.createElement('tr');
                    
                    const idCell = document.createElement('td');
                    idCell.textContent = customer.id;
                    row.appendChild(idCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = customer.name;
                    row.appendChild(nameCell);

                    const addressCell = document.createElement('td');
                    addressCell.textContent = customer.address;
                    row.appendChild(addressCell);

                    const salaryCell = document.createElement('td');
                    salaryCell.textContent = customer.salory;
                    row.appendChild(salaryCell);

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Initial data load
    fetchAndUpdateTable();

    // Set up live refresh every 30 seconds (30000 milliseconds)
    setInterval(fetchAndUpdateTable, 1000);
});



//  update code 

function updateCustomer() {
    let custId = document.querySelector('#CustomerManage .custId').value;
    let custName = document.querySelector('#CustomerManage .custName').value;
    let custAddress = document.querySelector('#CustomerManage .custAddress').value;
    let custSalary = document.querySelector('#CustomerManage .custSalary').value;

    // Validate input before sending
    if (!custId) {
        alert('Customer ID is required for update');
        return;
    }

    let customer = {
        id: custId,
        name: custName,
        address: custAddress,
        salory: custSalary 
    };

    const customerJSON = JSON.stringify(customer);
    console.log("Sending data:", customerJSON);

    fetch(`http://localhost:8080/pos_system_backend_war_exploded/customer?id=${custId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: customerJSON,
    })
    .then(response => {
        if (response.ok) {
            // Check if response body is empty
            if (response.status === 204) {
                return { message: 'Customer updated successfully' };
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
            alert('Customer updated successfully');
        }
        refresh(); // Clear form fields after successful update
        fetchAndUpdateTable(); // Refresh the table to reflect changes
    })
    .catch(error => {
        // console.error('Error:', error);
        // alert('An error occurred while updating the customer.');
    });
}




document.querySelector('#CustomerManage .cleatBtn').addEventListener('click', function() {
    refresh();
});





// exampel delet 

document.querySelector('#CustomerManage .removeBtn').addEventListener('click', async function() {
    let customerId = document.querySelector('#CustomerManage .custId').value;

    if (!customerId) {
        alert('Please enter a customer ID');
        return;
    }

    try {
        let response = await fetch(`http://localhost:8080/pos_system_backend_war_exploded/customer?cusId=${customerId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            if (response.status !== 204) { 
                let result = await response.json();
                alert(result.message);
            } else {
                alert("Customer deleted successfully");
            }
            refresh(); 
        } else {
            let error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the customer.');
    }
});




// // tabel row click and load 

document.querySelector('#CustomerManage .tableRow').addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName === 'TD') {
        let row = target.parentNode;
        let id = row.children[0].textContent;
        let name = row.children[1].textContent;
        let address = row.children[2].textContent;
        let salary = row.children[3].textContent;
        document.querySelector('#CustomerManage .custId').value = id;
        document.querySelector('#CustomerManage .custName').value = name;
        document.querySelector('#CustomerManage .custAddress').value = address;
        document.querySelector('#CustomerManage .custSalary').value = salary;
    }
}


);




