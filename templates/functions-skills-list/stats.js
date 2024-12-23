function update_point() {
    var total = 0;
    total += parseInt($("#STR").val());
    total += parseInt($("#INT").val());
    total += parseInt($("#VIT").val());
    total += parseInt($("#AGI").val());
    total += parseInt($("#DEX").val());
    total += parseInt($("#personal_val").val());

    if (total > MAX_STAT) {

        $("#totalstat").html(total);
        $("#totalstat").css("color", "red");
    }
    else {
        $("#totalstat").html(total);
        $("#totalstat").css("color", "black");
    }
}
function update_personal_stat() {
    if ($("#personal").val() == "NA") {
        $("#personal_val").val(0);
        $("#personal_val").attr("disabled", "disabled");
    }
    else {
        $("#personal_val").prop("disabled", false);
        if ($("#personal_val").val() < 1)
            $("#personal_val").val(1);
    }
    update_point();
}