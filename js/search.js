// function to search user list
function search_user(search_text) {
    search_text = search_text.trim();
    console.log(search_text);

    if (search_text == "") data_get_success(data_set);
    else if (search_text.length > 1) {
        // empty table
        $("#data_table_body").html("");

        // search and display matching data
        for (let i = 0; i < data_set.length; i++) {
            if (data_set[i]["fullName"].toLowerCase().includes(search_text.toLowerCase())) {
                console.log("match found");
                generate_data_row(i, data_set[i]);
            }
        }
    }
}