var date = new Date();
var wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
$(document).ready(setupContent);

function setupContent()
{
    //TODO: set week and year in timetable
    //TODO: get async data 
}

function getData()
{
    $.getJSON("https://sandbox.gibm.ch/berufe.php").done(data => {
    if(data.length > 0)
    {
        //TODO: populate jobs
        //TODO: get items from localstorage if avaiable 
    }
    }).fail(function()
    {
        //TODO: error to user
    })
}
function appendOptions(data) {
    $("#jobs").append(new Option("-bitte wählen-", 0))
    $.each(data, function(_key, value) {
        $("#jobs").append(new Option(value.beruf_name, value.beruf_id));
    });
}

function checkLocalStorage() {
    if (localStorage.getItem("job") != null) {
        $("#jobs").val(localStorage.getItem("job"));
    }
}
$("#Klassenauswahl").on("change", () => {
    $("#ZeitFenster").fadeOut(function() {
        localStorage.clear();
        localStorage.setItem("job", $("#jobs").find(":selected").val());
        loadClasses($("#jobs").find(":selected").val());
    });
});

function loadClasses(jobId) {
    $("#Klassenauswahl").find('option')
        .remove()
        .end()
    getClasses(jobId);
}

function getClasses(jobId) {
    $.getJSON("https://sandbox.gibm.ch/klassen.php?beruf_id=" + jobId,
        data => {
            if (data.length > 0) {
                appendClassOptions(data);
                checkLocalStorageForClassID();
            } else {
                //TODO: keine Klasse gefunden
                
            }
        }
    ).fail(() => {
        //TODO: keine Daten gefunden
    });
}

function appendClassOptions(data) {
    $("#Klassenauswahl").append(new Option("-bitte wählen-", 0));
    $.each(data, function(_key, value) {
        $("#Klassenauswahl").append(new Option(value.klasse_name, value.klasse_id));
    });
}

function checkLocalStorageForClassID() {
    
    if (localStorage.getItem("class") != null) {
        var classId = localStorage.getItem("class")
        $("#Klassenauswahl").val(classId);
        loadTimeTable(classId);
    }
}

function loadTimeTable(classId) {
    $("#timeTableBody").children().remove();
    if (classId != 0) {
        getTimeTable(classId)
    } else {
        //TODO
    }
}