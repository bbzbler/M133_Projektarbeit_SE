var date = new Date();
var wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
$(document).ready(setupContent);


function setupContent()
{
    $("#date").text((date.getWeek()) + "-" + date.getYear());
    getData();
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
        appendOptions(data);
    }
    }).fail(function()
    {
        //TODO: error to user
    })
}
function appendOptions(data) {
    $("#Berufsgruppen").append(new Option("-bitte wählen-", 0))
    $.each(data, function(_key, value) {
        $("#Berufsgruppen").append(new Option(value.beruf_name, value.beruf_id));
    });
}


function checkLocalStorage() {
    if (localStorage.getItem("Beruf") != null) {
        $("#Berufsgruppen").val(localStorage.getItem("Beruf"));
    }
}
$("#Klassenauswahl").on("change", () => {
    $("#ZeitFenster").fadeOut(function() {
        localStorage.clear();
        localStorage.setItem("Beruf", $("#Berufsgruppen").find(":selected").val());
        loadClasses($("#Berufsgruppen").find(":selected").val());
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
    
    if (localStorage.getItem("Klasse") != null) {
        var classId = localStorage.getItem("Klasse")
        $("#Klassenauswahl").val(classId);
        loadTimeTable(classId);
    }
}

function loadTimeTable(classId) {
    $("#contentBody").children().remove();
    if (classId != 0) {
        getTimeTable(classId)
    } else {
        //TODO:
    }
}
function getTimeTable(classId) {
    $.getJSON("https://sandbox.gibm.ch/tafel.php?klasse_id=" + classId + "&woche=" + date.getWeek() + "-" + date.getFullYear(),
        function(data) {
            if (data.length > 0) {
                appendTimeTable(data)
            } else {
                //TODO:
            }
        }

    );
}
Date.prototype.getWeek = function() {
    //getting the weeks since the first day of the year
    let firstjan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - firstjan) / 86400000) + firstjan.getDay() + 1) / 7) - 1;
}

Date.prototype.addWeek = function() {
    //eine woche später
    this.setDate(this.getDate() + 7);
}

Date.prototype.substractWeek = function() {
    //eine woche vorher
    this.setDate(this.getDate() - 7);
}

const myDatePicker = MCDatepicker.create({
    el: '#date',
    selectedDate: new Date(),
    disableWeekends: true
})

myDatePicker.onSelect((dt) => {
    date = new Date(Date.parse(dt));
    if (date == "Invalid Date") {
        date = new Date();
    }
    updateTable();
});
function updateTable() {
    $("#date").text(date.getWeek()) + "-" + date.getFullYear();
    loadTimeTable($("#Klassenauswahl").find(":selected").val());
}
