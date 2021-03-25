function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

let today = getTodayDate();
document.getElementById("datePicker").value = today;

function changeCompany() {
    let co = document.getElementById("company").value;
    if (co == "Storetasker") {
        document.getElementById("currency").value = "USD";
    } else if (co == "Crisp") {
        document.getElementById("currency").value = "EUR";
    }

}