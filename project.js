var date = new Date();
var wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
$(document).ready(setupContent);


function setupContent()
{
    $("#date").text((date.getWeek()) + "-" + date.getFullYear());
    getData();
    
}

function getData()
{
    $.getJSON("https://sandbox.gibm.ch/berufe.php").done(data => {
    if(data.length > 0)
    {
       
        appendOptions(data); 
        if (localStorage.getItem("Beruf") != null) {
            $("#Beruf").val(localStorage.getItem("Beruf"));
        }
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
    loadClasses($("#Berufsgruppen").find(":selected").val());
}


function checkLocalStorage() {
    if (localStorage.getItem("Beruf") != null) {
        $("#Berufsgruppen").val(localStorage.getItem("Beruf"));
    }
}
$("#Berufsgruppen").on("change", () => {
    //Alle Berufe laden
    $("#ZeitFenster").fadeOut(function() {
        localStorage.clear();
        localStorage.setItem("Beruf", $("#Berufsgruppen").find(":selected").val());
        loadClasses($("#Berufsgruppen").find(":selected").val());
    });
});
$("#Klassenauswahl").on("change", () => {
    //Alle Klassen laden
    $("#ZeitFenster").fadeOut(function() {
        localStorage.clear();
        localStorage.setItem("Klasse", $("#Klassenauswahl").find(":selected").val());
        loadClasses($("#Klassenauswahl").find(":selected").val());
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
function appendTimeTable(data) {
    //for each row
    $.each(data, function(_key, value) {
        //apend row
        $("#contentBody").append("<tr><th>" + value.tafel_datum + "</th><th>" + weekDays[value.tafel_wochentag - 1] +
            "</th><th>" + value.tafel_von + "</th><th>" + value.tafel_bis + "</th><th>" + value.tafel_lehrer + "</th><th>" + value.tafel_longfach +
            "</th><th>" + value.tafel_raum + "</th></tr>");
    });
    //show content
    $("#content").fadeIn();
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
$("#left").on("click",e => {
    e.preventDefault();
    date.substractWeek();
    updateTable();
})
$("#right").on("click",e => {
    e.preventDefault();
    date.addWeek();
    updateTable();
})

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
