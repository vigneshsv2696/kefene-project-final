console.clear();

/*

Functionality:
    - The login form has only one validation which is "username and password should be the same".
    - If the values differ then show an alert which says, "Please enter valid credentials!".
    - If the values are the same then show an alert which says, "Login Successful" and redirect to the orders page.
    - You have to maintain the user session i.e., if the user closes the browser and comes back he/she should be able to see correct logged-in status.
	
*/

function check_login(event) {
    // stop default action
    event.preventDefault();

    // validation criteria provided is - "username and password should be the same".
    if ($("#username").val() == $("#password").val()) {
        alert("Login Successful");
        localStorage.setItem("logged_in", "true");
        $(location).attr("href", "admin.html");
    }
    else {
        alert("Invalid Login Credentials");
    }
}

// call function on form submit
$("#login_form").submit(check_login);

// check if login is already done
if (localStorage.getItem("logged_in") == "true") {
    console.log("user already logged in");
    $(location).attr("href", "admin.html");
}