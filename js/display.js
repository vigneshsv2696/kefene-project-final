// show or hide elements based on filter
function flip_display(filter) {
    console.log(filter.value + " set to " + filter.checked);

    if (filter.checked) {
        $("." + filter.value).show();
        // update data count
        $("#data_count").html($('tr:visible').length - 1);
    }
    else {
        $("." + filter.value).hide();
        // update data count
        $("#data_count").html($('tr:visible').length - 1);
    }
}