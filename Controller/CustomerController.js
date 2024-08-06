


//save customer

document.addEventListener('DOMContentLoaded', function() {
    refresh();
});

document.querySelector('#CustomerManage #customerForm').addEventListener('submit', function(event) {
    event.preventDefault();
});


document.querySelector('#CustomerManage .updateBtn').addEventListener('click', function() {
    updateCustomer();
});

document.querySelector('#CustomerManage .saveBtn').addEventListener('click', function() {

    
    let custId = document.querySelector('#CustomerManage .custId').value;
    let custName = document.querySelector('#CustomerManage .custName').value;
    let custAddress = document.querySelector('#CustomerManage .custAddress').value;
    let custSalary = document.querySelector('#CustomerManage .custSalary').value;

    let customer = {
        id: custId,
        name: custName,
        address: custAddress,
        salory: custSalary // Make sure this matches the DTO field
    };

    const customerJSON = JSON.stringify(customer);
    console.log("Sending data:", customerJSON);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            console.log("Response text:", http.responseText); // Add this line for debugging
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
                fetchAndUpdateTable();
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








//Define the refresh function

function refresh() {
    console.log("Refresh function called");
    // Clear form fields
    document.querySelector('#CustomerManage .custId').value = '';
    document.querySelector('#CustomerManage .custName').value = '';
    document.querySelector('#CustomerManage .custAddress').value = '';
    document.querySelector('#CustomerManage .custSalary').value = '';
}



// function validate(customer) {
//     let valid = true;

//     if ((/^C0[0-9]+$/).test(customer.custId)) {
//         document.querySelector('#CustomerManage .invalidCustId').textContent = '';
//         valid = true;
//     } else {
//         document.querySelector('#CustomerManage .invalidCustId').textContent = 'Invalid Customer Id';
//         valid = false;
//     }

//     if ((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(customer.custName)) {
//         document.querySelector('#CustomerManage .invalidCustName').textContent = '';
//     } else {
//         document.querySelector('#CustomerManage .invalidCustName').textContent = 'Invalid Customer Name';
//         valid = false;
//     }

//     if ((/^[A-Z][a-z, ]+$/).test(customer.custAddress)) {
//         document.querySelector('#CustomerManage .invalidCustAddress').textContent = '';
//     } else {
//         document.querySelector('#CustomerManage .invalidCustAddress').textContent = 'Invalid Customer Address';
//         valid = false;
//     }

//     if (customer.custSalary != null && customer.custSalary > 0) {
//         document.querySelector('#CustomerManage .invalidCustSalary').textContent = '';
//     } else {
//         document.querySelector('#CustomerManage .invalidCustSalary').textContent = 'Invalid Customer Salary';
//         valid = false;
//     }

//     let customers = getAllCustomers();
//     for (let i = 0; i < customers.length; i++) {
//         if (customers[i].custId === customer.custId) {
//             document.querySelector('#CustomerManage .invalidCustId').textContent = 'Customer Id Already Exists';
//             valid = false;
//         }
//     }

//     return valid;
// }










//correct but not support layed  load table

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







//Correct update code

// Update customer functionality
// function updateCustomer() {
//     let custId = document.querySelector('#CustomerManage .custId').value;
//     let custName = document.querySelector('#CustomerManage .custName').value;
//     let custAddress = document.querySelector('#CustomerManage .custAddress').value;
//     let custSalary = document.querySelector('#CustomerManage .custSalary').value;

//     // Validate input before sending (you can implement more validation if needed)
//     if (!custId) {
//         alert('Customer ID is required for update');
//         return;
//     }

//     let customer = {
//         id: custId,
//         name: custName,
//         address: custAddress,
//         salory: custSalary // Ensure this matches the DTO field
//     };

//     const customerJSON = JSON.stringify(customer);
//     console.log("Sending data:", customerJSON);

//     const http = new XMLHttpRequest();
//     http.onreadystatechange = () => {
//         if (http.readyState == 4) {
//             console.log("Response text:", http.responseText); // Add this line for debugging
//             if (http.status == 200) {
//                 try {
//                     var responseJSON = JSON.parse(http.responseText);
//                     console.log("Response from server:", responseJSON);
//                     alert(responseJSON.message);
//                 } catch (e) {
//                     console.error("Failed to parse JSON response:", e);
//                     console.error("Response text:", http.responseText);
//                 }
//                 refresh(); // Clear form fields after successful update
//                 fetchAndUpdateTable(); // Refresh the table to reflect changes
//             } else {
//                 console.error("Failed to update customer");
//                 console.error("Status:", http.status);
//                 console.error("Response:", http.responseText);
//             }
//         }
//     };
//     http.open("PUT", "http://localhost:8080/pos_system_backend_war_exploded/customer", true);
//     http.setRequestHeader("Content-Type", "application/json");
//     http.send(customerJSON);
// }

// // Adding event listener to the update button
// document.querySelector('#CustomerManage .updateBtn').addEventListener('click', function() {
//     updateCustomer();
// });








// exampel update code 

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
        salory: custSalary // Ensure this matches the DTO field
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

// Adding event listener to the update button
document.querySelector('#CustomerManage .updateBtn').addEventListener('click', function() {
    updateCustomer();
});






















// function extractNumber(id) {
//     var match = id.match(/C0(\d+)/);
//     if (match && match.length > 1) {
//         return parseInt(match[1]);
//     }
//     return null;
// }



// function createCustomerId() {
//     let customers = getAllCustomers();
    
//     if (!customers || customers.length === 0) {
//         return 'C01';
//     } else {
//         let lastCustomer = customers[customers.length - 1];
//         let id = lastCustomer && lastCustomer.custId ? lastCustomer.custId : 'C00';
        
//         let number = extractNumber(id);
//         number++;
//         return 'C0' + number;
//     }
// }

// function refresh() {
//     document.querySelector('#CustomerManage .custId').value = createCustomerId();
//     document.querySelector('#CustomerManage .custName').value = '';
//     document.querySelector('#CustomerManage .custAddress').value = '';
//     document.querySelector('#CustomerManage .custSalary').value = '';
//     document.querySelector('#CustomerManage .invalidCustId').textContent = '';
//     document.querySelector('#CustomerManage .invalidCustName').textContent = '';
//     document.querySelector('#CustomerManage .invalidCustAddress').textContent = '';

//     reloadTable();
// }

document.querySelector('#CustomerManage .cleatBtn').addEventListener('click', function() {
    refresh();
});

// document.querySelector('#CustomerManage .searchBtn').addEventListener('click', function() {
//     let customerId = document.querySelector('#CustomerManage .custId').value;
//     let customer = searchCustomer(customerId);
//     if (customer) {
//         document.querySelector('#CustomerManage .custName').value = customer.custName;
//         document.querySelector('#CustomerManage .custAddress').value = customer.custAddress;
//         document.querySelector('#CustomerManage .custSalary').value = customer.custSalary;
//     } else {
//         alert('Customer Not Found');
//     }
// });

// document.querySelector('#CustomerManage .updateBtn').addEventListener('click', function() {
//     let updateCustomerId = document.querySelector('#CustomerManage .custId').value;
//     let updateCustomer = {
//         custId: updateCustomerId,
//         custName: document.querySelector('#CustomerManage .custName').value,
//         custAddress: document.querySelector('#CustomerManage .custAddress').value,
//         custSalary: document.querySelector('#CustomerManage .custSalary').value
//     };

//     let validResult = validate(updateCustomer);

//     if (validResult) {
//         let customers = getAllCustomers();
//         let index = customers.findIndex(c => c.custId === updateCustomer.custId);
//         updateCustomer(index, updateCustomer);
//         refresh();
//     }
// });

// function reloadTable() {
//     let customers = getAllCustomers();
//     let tableRow = document.querySelector('#CustomerManage .tableRow');
//     tableRow.innerHTML = '';
//     customers.forEach(c => {
//         loadTable(c);
//     });
// }






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
            if (response.status !== 204) { // Check if the response has content
                let result = await response.json();
                alert(result.message);
            } else {
                alert("Customer deleted successfully");
            }
            refresh(); // Assuming refresh() is a function to reload the customer list
        } else {
            let error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the customer.');
    }
});































// not layed Corect Delete

// document.querySelector('#CustomerManage .removeBtn').addEventListener('click', async function() {
//     let customerId = document.querySelector('#CustomerManage .custId').value;

//     if (!customerId) {
//         alert('Please enter a customer ID');
//         return;
//     }

//     try {
//         let response = await fetch(`http://localhost:8080/pos_system_backend_war_exploded/customer?id=${customerId}`, {
//             method: 'DELETE',
//         });

//         if (response.ok) {
//             let result = await response.json();
//             alert(result.message);
//             refresh(); // Assuming refresh() is a function to reload the customer list
//         } else {
//             let error = await response.json();
//             alert(error.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while deleting the customer.');
//     }
// });







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




