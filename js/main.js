console.clear();

/*

---- Orders ----

Functionality:
    - On page load send a call to the backend to fetch all the orders.
    - Users should be able to filter using the checkboxes based on order status which can be New, Packed, InTransit and Delivered.

API Details:
    Endpoint: https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/orders
    Request Type: GET

---- Products ----

Functionality:
    - On page load send a call to the backend to fetch all the products.
    - Users should be able to filter the products using the checkboxes based on expiry and stock.
    - A product is expired if the expiry date is less then current date.
    - A product is low stock if the stock count is less than 100.

API Details:
    Endpoint: https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products
    Request Type: GET

---- Users ----

Functionality:
    - On page load send a call to the backend to fetch all the users.
    - The admin should be able to search users based on the first and last name.
    - Search should work only when the characters entered are 2 or more.
    - If the admin tries to search a user by typing less than 2 characters then show an alert which says, "Please enter at least 2 characters".
    - On a successful search API call, the table should show only the search results.
    - On the Reset button click, reset the search field and show all the users.

API Details:
    User List Endpoint: https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users
    Request Type: GET

    User Search Endpoint: https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users?fullName=John
    Request Type: GET

*/

const site_structure = {
    "pages": ["order", "product", "user"],
    "order": {
        "api": "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/orders",
        "filter": ["New", "Packed", "InTransit", "Delivered"],
        "data_headings": ["ID", "Customer", "Date", "Amount", "Status"]
    },
    "product": {
        "api": "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products",
        "filter": ["Expired", "Low Stock"],
        "data_headings": ["ID", "Product Name", "Product Brand", "Expiry Date", "Unit Price", "Stock"]
    },
    "user": {
        "api": "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users",
        "data_headings": ["ID", "User Avatar", "Full Name", "DoB", "Gender", "Current Location"]
    }
};

var page = "order";
var data_set;

// generate and add rows to table
function generate_data_row(index, value) {
    temp_row = "";

    if (page == "order") {
        temp_row = $('<tr>' +
            '<td class="silent-text">' + value["id"] + '</td>' +
            '<td>' + value["customerName"] + '</td>' +
            '<td class="text-no-wrap">' + value["orderDate"] + '<br><span class="silent-text">' + value["orderTime"] + '</span></td>' +
            '<td class="silent-text">' + value["amount"] + '</td>' +
            '<td>' + value["orderStatus"] + '</td>' +
            '</tr>');

        temp_row.addClass(value["orderStatus"].toLowerCase());
    }
    else if (page == "product") {
        temp_row = $('<tr id="' + value["id"] + '" class="' + '">' +
            '<td class="silent-text">' + value["id"] + '</td>' +
            '<td>' + value["medicineName"] + '</td>' +
            '<td class="silent-text">' + value["medicineBrand"] + '</td>' +
            '<td class="text-no-wrap">' + value["expiryDate"] + '</td>' +
            '<td class="silent-text">' + value["unitPrice"] + '</td>' +
            '<td class="silent-text">' + value["stock"] + '</td>' +
            '</tr>');

        if (new Date(value["expiryDate"]) < new Date()) temp_row.addClass("expired");
        if (value["stock"] < 100) temp_row.addClass("low_stock");
    }
    else if (page == "user") {
        temp_row = $('<tr id="' + value["id"] + '">' +
            '<td class="silent-text">' + value["id"] + '</td>' +
            '<td>' +
            '<img src="' + value["profilePic"] + '" alt="Profile Pic">' +
            '</td>' +
            '<td class="silent-text">' + value["fullName"] + '</td>' +
            '<td class="text-no-wrap">' + value["dob"] + '</td>' +
            '<td class="silent-text">' + value["gender"] + '</td>' +
            '<td class="silent-text">' + value["currentCity"] + ', ' + value["currentCountry"] + '</td>' +
            '</tr>');
    }

    $("#data_table_body").append(temp_row);
}

function data_get_success(data) {
    console.log("data obtained succefully");
    console.log(data);

    // backup data
    data_set = data;

    let temp_row = "";

    // generate filters for page
    /*
        <label class="filter-item">
            <input type="checkbox" name="new" value="new" checked>New
        </label>
    */
    if (page == 'user') {
        // update body box html
        $("#body_box").html('<h1>Users</h1>' +
            '<div class="row">' +
            '<form id="search_box_form" class="row">' +
            '<input class="search_box" type="search" placeholder="Search by Name" onkeyup="search_user(this.value);" onsearch="search_user(this.value);">' +
            '<input class="search_button" type="reset" value="Reset" onclick="search_user(\'\');">' +
            '</form>' +
            '</div>' +
            '<div class="row">' +
            '<table>' +
            '<thead id="data_table_head">' +
            '<!-- data table heading row will be added here -->' +
            '</thead>' +
            '<tbody id="data_table_body">' +
            '<!-- data table rows will be added here -->' +
            '</tbody>' +
            '</table>' +
            '</div>');
    }
    else {
        // update body box html
        $("#body_box").html('<h1 id="section_heading">' + page + '</h1>' +
            '<div class="row">' +
            '<div class="column filter_section">' +
            '<h3 class="m-0">Filters</h3>' +
            '<p class="data_count">Count: <span id="data_count"></span></p>' +
            '<div id="filter_items" class="column">' +
            '<!-- data filters -->' +
            '</div>' +
            '</div>' +
            '<div class="column data_section">' +
            '<table>' +
            '<thead id="data_table_head">' +
            '<!-- data table heading row will be added here -->' +
            '</thead>' +
            '<tbody id="data_table_body">' +
            '<!-- data table rows will be added here -->' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>'
        );

        // genrate filters
        $("#filter_items").html("");
        $.each(site_structure[page]["filter"], function (index, value) {
            temp_row = '<label class="filter-item">' +
                '<input type="checkbox" name="' + value.toLowerCase() + '" value="' + value.toLowerCase().replace(/ /g, "_") + '" onclick="flip_display(this);" checked>' + value +
                '</label>';
            $("#filter_items").append(temp_row);
        });
    }

    // generate table heading row
    temp_row = "<tr>";
    $.each(site_structure[page]["data_headings"], function (index, value) {
        temp_row = temp_row + "<th>" + value + "</th>";
    });
    temp_row = temp_row + "</tr>";
    $("#data_table_head").html(temp_row);

    $("#data_table_body").html("");
    $.each(data, generate_data_row);

    // update data count to page
    $("#data_count").html(data.length);

    console.log("page updated successfully");
}

function data_get_fail(error) {
    console.log("failed to get data list");
    console.log(error);
}

// main function to load data as per navigation
function go_to(new_page) {
    // change active state in navbar
    $("#" + page + "-link").removeClass("active");
    page = new_page;
    $("#" + page + "-link").addClass("active");

    // ajax data collection
    $.ajax({
        method: "GET",
        url: site_structure[page]["api"],
        success: data_get_success,
        error: data_get_fail
    });
}

// function to load order page by default
$(document).ready(go_to("order"));