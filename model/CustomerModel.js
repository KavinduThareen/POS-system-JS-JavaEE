

export function saveCustomer(customer) {
    Customers.push(customer);
}

export function getAllCustomers() {
    return Customers;
}

export function updateCustomer(index , customer){
    Customers[index] = customer;
}

export function deleteCustomer(index){
    Customers.splice(index, 1);
}