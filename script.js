var lines = [];
var commands = {};

// Colors
let infoColor = "#ffffff"
let warnColor = "#e4d500"
let errorColor = "#e20000"

const mismatchText = "Command does not exist! Check for spelling mistakes and try again.";

const outputBox = document.getElementById("output"); // Reference the DOM "output" textarea
const inputBox = document.getElementById("input"); // Reference the DOM "input" anchor

const autocompleteDiv = document.getElementById("autocomplete"); // Reference the DOM "autocomplete" div

inputBox.addEventListener("keydown", function(e) {
    if (e.key == "Enter") { // Check for "enter" press from user
        var input = inputBox.value.trim(); // Trim leading and trailing white spaces from string input

        if (input.split(" ")[0] in commands) { // Check if command exists (ruling out args)
            var cmd = commands[input.split(" ")[0]]; // Init variable as first part of input (command)
            var arg1 = input.split(" ")[1]; // Init variable as second part of input (argument 1)
            if (cmd.type == "") {
                if (cmd.arg && arg1 != undefined) { // Check if commands needs argeters
                    lines.push([`${input}<br>${arg1}<br>${cmd.run()}<br>true`, cmd.type]); // Push input to to log without type prefix
                }
                else {
                    lines.push([`${input}<br>${cmd.run()}<br>false`, cmd.type])
                }
            }
            else {
                lines.push([`${input}<br>[${cmd.type.toUpperCase()}]${cmd.run()}`, cmd.type]); // Push input to to log with type prefix
            }
        }
        else {
            lines.push([`${input}<br>[ERROR]${mismatchText}`, "error"])
        }

        inputBox.value = ""; // Clear "input"

        UpdateOutputBuffer(); // Call the output buffer update
    }

    CheckAutocomplete(inputBox.value, false);
})

function UpdateOutputBuffer() {
    outputBox.innerHTML = null; // Clear "textarea"
    for (i = 0; i < lines.length; i++) { // Repeat through
        var color;
        var type = lines[i][1];
        if (type == "") {
            color = "#a5a5a5";
        }
        else if (type == "info") {
            color = infoColor;
        }
        else if (type == ("warn")) {
            color = warnColor;
        }
        else {
            color = errorColor;
        }

        outputBox.innerHTML += `<a style="color: ${color}">>${lines[i][0]}</a><br><br>` // Append line text and line number to the "textarea"
    }
    outputBox.scrollTop = outputBox.scrollHeight; // Scroll to bottom
}

commands.help = {
    type: "",
    arg: false,
    run: function() {
        return(`Commands: ${Object.getOwnPropertyNames(commands).toString()}`)
    }
}
commands.info = {
    type: "info",
    arg: false,
    run: function() {
        return('Developer: Zane "squidee_" Shaw')
    }
}
commands.warn = {
    type: "warn",
    arg: false,
    run: function() {
        return("Uh oh! Something bad probably happened...")
    }
}
commands.error = {
    type: "error",
    arg: false,
    run: function() {
        return("Unhandled command! Please contact the developer.")
    }
}
commands.sum = {
    type: "",
    arg: true,
    run: function() {
        var blah = 1 + 2;
        return(blah)
    }
}


function CheckAutocomplete(input, hide) {
    autocompleteDiv.style.left = `${inputBox.selectionStart * 7.175 + 25}px`;

    autocompleteDiv.children[0].innerHTML = "";
    if (inputBox.value != "") {
        for (var i = 0; i < Object.keys(commands).length; i++) {
            if (Object.keys(commands)[i].startsWith(input)) {
                autocompleteDiv.children[0].innerHTML += `<li>${Object.keys(commands)[i]}</li>`;
            }
        }
    }

    $(autocompleteDiv.children[i]).off(); // Remove previous event listeners
    for (var i = 0; i < autocompleteDiv.children[0].childElementCount; i++) {
        $(autocompleteDiv.children[0].children[i]).on("click", function() { // Add an event listener to all current autocomplete items
            inputBox.value = this.innerHTML; // Set input value
            CheckAutocomplete(inputBox.value, true);
        })
    }

    if(hide) {
        autocompleteDiv.children[0].innerHTML = "";
    }
}

inputBox.addEventListener("input", function() {
    CheckAutocomplete(inputBox.value, false);
});
