const {
    getAllFilePathsWithExtension,
    readFile
} = require('./fileSystem');
const {
    readLine
} = require('./console');

var name_len = 4;
var date_len = 4;
var comm_len = 7;
var file_len = 8;
var arrFilesNames = [];
var arrComment = ["comment"];
var arrName = ["user"];
var arrDate = ["date"];
var arrImp = [1];
var arrFile = ["fileName"];

app();

function app() {
    const files = getFiles();
    getFilesNames();
    devideInFiveArrays(files);
    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getFilesNames() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    for (let filePath of filePaths)
        arrFilesNames.push(filePath.replace(process.cwd() + "/", ""));
}

function devideInFiveArrays(files) {
    const commPattern = /.*\/\/\s*todo\s*(?::|\s)\s*/i;
    const quotePattern = /(?:(["'])\1)|(?:(['"]).*?[^\\]\2)/; //поиск "" '' в строке
    const todoPattern = /\/\/\s*todo/i;
    var datePosition = -1;
    var commPosition = -1;
    var counter = 1;
    var arrFileString = [];
    for (let i = 0; i < files.length; i++) {
        arrFileString = files[i].split("\n");
        for (let j = 0; j < arrFileString.length; j++) {
        	let test1 = (arrFileString[j].search(quotePattern) < arrFileString[j].search(todoPattern));
        	let test2 = arrFileString[j].search(quotePattern) !== -1;
            while (test1 && test2) {
                arrFileString[j] = arrFileString[j].replace(quotePattern, "");
                test1 = (arrFileString[j].search(quotePattern) < arrFileString[j].search(todoPattern));
        		test2 = arrFileString[j].search(quotePattern) !== -1;
            }
            if (arrFileString[j].search(commPattern) > -1) {
                arrFileString[j] = arrFileString[j].replace(commPattern, "");
                datePosition = arrFileString[j].indexOf(";");
                commPosition = arrFileString[j].indexOf(";", datePosition + 1);
                if (datePosition > -1 && commPosition > -1) {
                    let regExp = /\s*;\s*/;
                    arrFileString[j] = arrFileString[j].replace(regExp, ";");
                    datePosition = arrFileString[j].indexOf(";");
                    arrFileString[j] = arrFileString[j].replace(regExp, "");
                    arrFileString[j] = arrFileString[j].replace(regExp, ";");
                    arrFileString[j] = arrFileString[j].slice(0, datePosition) + ";" + 
                    				   arrFileString[j].slice(datePosition, arrFileString[j].length);
                    commPosition = arrFileString[j].indexOf(";", datePosition + 1);
                }
                //name
                if (datePosition > -1 && commPosition > -1) {
                    arrName[counter] = arrFileString[j].slice(0, datePosition);
                } else arrName[counter] = "";
                if (arrName[counter].length > 10)
                    arrName[counter] = arrName[counter].substr(0, 7) + "...";
                //date
                if (commPosition !== datePosition + 1 && commPosition !== -1) {
                    arrDate[counter] = arrFileString[j].slice(datePosition + 1, commPosition);
                } else arrDate[counter] = "";
                dateValid(counter);
                //comment
                if (datePosition !== -1 && commPosition !== -1) {
                    arrComment[counter] = arrFileString[j].slice(commPosition + 1, arrFileString[j].length);
                } else arrComment[counter] = arrFileString[j];
                if (arrComment[counter].length > 50)
                    arrComment[counter] = arrComment[counter].substr(0, 47) + "...";
                //importance
                if (/!/.test(arrComment[counter]))
                    arrImp[counter] = arrComment[counter].match(/!/g).length;
                else arrImp[counter] = 0;
                //filesnames
                if (arrFilesNames[i].length < 16)
                    arrFile[counter] = arrFilesNames[i];
                else arrFile[counter] = arrFilesNames[i].substr(0, 12) + "...";
                counter++;
                datePosition = -1;
                commPosition = -1;
            }

        }
    }
    arrFilesNames = null;
}

function dateValid(counter) {
    if (arrDate[counter].length === 4) {
        if (arrDate[counter].search(/\d{4}/) === -1)
            arrDate[counter] = "";
    } else if (arrDate[counter].length === 6) {
        if (arrDate[counter].search(/^\d{4}-[1-9]/) === -1) //1234-2
            arrDate[counter] = "";
    } else if (arrDate[counter].length === 7) {
        if (arrDate[counter].search(/^\d{4}-(0[1-9]|1[0-2])/) === -1) //1234-12
            arrDate[counter] = "";
    } else if (arrDate[counter].length === 8) {
        let test1=arrDate[counter].search(/^\d{4}-[1-9]-[1-9]/);//1234-2-2
        let test2=arrDate[counter].search(/^[1-9]-[1-9]-\d{4}/);//2-2-1234
        if (test1 === -1 && test2 === -1) 
            arrDate[counter] = "";
    } else if (arrDate[counter].length === 9) {
        let test1 = arrDate[counter].search(/^\d{4}-(0[1-9]|1[0-2])-[1-9]/); //1234-12-2
        let test2 = arrDate[counter].search(/^\d{4}-[1-9]-(0[1-9]|[12]\d|3[01])/); //1234-2-12
        let test3 = arrDate[counter].search(/^(0[1-9]|1[0-2])-[1-9]-\d{4}/); //12-2-1234
        let test4 = arrDate[counter].search(/^[1-9]-(0[1-9]|[12]\d|3[01])-\d{4}/); //2-12-1234
        if (test1 === -1 && test2 === -1 && test3 === -1 && test4 === -1)
            arrDate[counter] = "";
    } else if (arrDate[counter].length === 10) {
        let test1 = arrDate[counter].search(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/); //1234-12-12
        let test2 = arrDate[counter].search(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}/); //12-12-1234
        if (test1 === -1 && test2 === -1)
            arrDate[counter] = "";
    } else arrDate[counter] = "";
}

function processCommand(command) {
    switch (true) {
        case command.trim() === 'exit':
            process.exit(0);
            break;
        case command.trim() === 'show':
            let showOutput = [];
            showOutput = show(0);
            writeLine(showOutput);
            showOutput = null;
            break;
        case command.trim() === 'important':
            let impOutput = [];
            impOutput = important();
            writeLine(impOutput);
            impOutput = null;
            break;
        case command.trim().substr(0, 4) === 'user':
            command = command.trim().substr(4).trim();
            let userOutput = [];
            userOutput = user(command);
            writeLine(userOutput);
            userOutput = null;
            break;
        case command.trim().substr(0, 4) === 'sort':
            command = command.trim().substr(4).trim();
            if (command !== 'user' && command !== 'date' && command !== 'importance') {
                console.log('wrong command');
                break;
            }
            let sortOutput = [];
            sortOutput = progSort(command);
            writeLine(sortOutput);
            sortOutput = null;
            break;
        case command.trim().substr(0, 4) === 'date':
            command = command.trim().substr(4).trim();
            let test1 = /^\d{4}/.test(command);
            let test2 = /^\d?\d-\d?\d-\d{4}/.test(command);
            if (command === '' || (!test1 && !test2) || command.length > 10) {
                console.log('wrong command');
                break;
            }
            let dateOutput = [];
            dateOutput = date(command);
            writeLine(dateOutput);
            dateOutput = null;
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show() {
    var arrOutput = [];
    for (let i = 0; i < arrComment.length; i++) {
        if (arrName[i].length > name_len)
            name_len = arrName[i].length;
        if (arrDate[i].length > date_len)
            date_len = arrDate[i].length;
        if (arrComment[i].length > comm_len)
            comm_len = arrComment[i].length;
        if (arrFile[i].length > file_len)
            file_len = arrFile[i].length;
    }
    for (let i = 0; i < arrComment.length; i++) {
        if (arrImp[i] !== 0)
            arrOutput[i] = "  !  " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
            "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
            "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
            "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
        else
            arrOutput[i] = "     " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
            "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
            "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
            "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
    }
    name_len = 4;
    date_len = 4;
    comm_len = 7;
    file_len = 8;
    return arrOutput;
}

function important() {
    var arrOutput = [];
    var counter = 0;
    for (let i = 0; i < arrComment.length; i++) {
        if (arrName[i].length > name_len && arrImp[i] !== 0)
            name_len = arrName[i].length;
        if (arrDate[i].length > date_len && arrImp[i] !== 0)
            date_len = arrDate[i].length;
        if (arrComment[i].length > comm_len && arrImp[i] !== 0)
            comm_len = arrComment[i].length;
        if (arrFile[i].length > file_len && arrImp[i] !== 0)
            file_len = arrFile[i].length;
    }

    for (let i = 0; i < arrComment.length; i++) {
        if (arrImp[i] !== 0) {
            arrOutput[counter] = "  !  " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
                "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
                "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
                "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
            counter++;
        }
    }
    name_len = 4;
    date_len = 4;
    comm_len = 7;
    file_len = 8;
    return arrOutput;
}

function user(command) {
    var arrOutput = [];
    var regexp = new RegExp(command, "i");
    var counter = 1;
    for (let i = 0; i < arrComment.length; i++) {
        if (arrName[i].search(regexp) === 0) {
            if (arrName[i].length > name_len)
                name_len = arrName[i].length;
            if (arrDate[i].length > date_len)
                date_len = arrDate[i].length;
            if (arrComment[i].length > comm_len)
                comm_len = arrComment[i].length;
            if (arrFile[i].length > file_len)
                file_len = arrFile[i].length;
        }
    }
    arrOutput[0] = "  !  " + "|  " + arrName[0] + ' '.repeat(name_len - arrName[0].length) +
        "  |  " + arrDate[0] + ' '.repeat(date_len - arrDate[0].length) +
        "  |  " + arrComment[0] + ' '.repeat(comm_len - arrComment[0].length) +
        "  |  " + arrFile[0] + ' '.repeat(file_len - arrFile[0].length) + "  ";

    for (let i = 1; i < arrComment.length; i++) {
        if (arrName[i].search(regexp) === 0) {
            if (arrImp[i] !== 0)
                arrOutput[counter] = "  !  " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
                "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
                "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
                "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
            else
                arrOutput[counter] = "     " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
                "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
                "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
                "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
            counter++;
        }
    }
    name_len = 4;
    date_len = 4;
    comm_len = 7;
    file_len = 8;
    return arrOutput;
}

function progSort(command) {
    var list = [];
    var arrOutput = [];
    for (let i = 0; i < arrComment.length; i++) {
        if (arrName[i].length > name_len)
            name_len = arrName[i].length;
        if (arrDate[i].length > date_len)
            date_len = arrDate[i].length;
        if (arrComment[i].length > comm_len)
            comm_len = arrComment[i].length;
        if (arrFile[i].length > file_len)
            file_len = arrFile[i].length;
    }
    arrOutput[0] = "  !  " + "|  " + arrName[0] + ' '.repeat(name_len - arrName[0].length) +
        "  |  " + arrDate[0] + ' '.repeat(date_len - arrDate[0].length) +
        "  |  " + arrComment[0] + ' '.repeat(comm_len - arrComment[0].length) +
        "  |  " + arrFile[0] + ' '.repeat(file_len - arrFile[0].length) + "  ";

    for (let i = 1; i < arrComment.length; i++)
        list.push({
            'Name': arrName[i],
            'Date': arrDate[i],
            'Comment': arrComment[i],
            'File': arrFile[i],
            'Imp': arrImp[i],
            'CommIndex': i
        });

    if (command === 'importance') {
        list.sort(function(a, b) {
        	let stability = b.File > a.File ? -1 : b.File < a.File ? 1 : a.CommIndex - b.CommIndex;
            return b.Imp - a.Imp === 0 ? stability : b.Imp - a.Imp;
        });
    }

    if (command === 'user') {
        list.sort(function(a, b) {
            let Name1 = a.Name.toLowerCase();
            let Name2 = b.Name.toLowerCase();
            let stability = b.File > a.File ? -1 : b.File < a.File ? 1 : a.CommIndex - b.CommIndex;
            if (Name1 === '' && Name2 === '') return stability;
            if (Name1 === '') return 1;
            if (Name2 === '') return -1;
            return Name2 < Name1 ? 1 : Name2 > Name1 ? -1 : b.Name < a.Name ? 1 : b.Name > a.Name ? -1 :stability;
        })
    }

    if (command === 'date') {
        list.sort(function(a, b) {
            let Date1 = Date.parse(a.Date);
            let Date2 = Date.parse(b.Date);
            let stability = b.File > a.File ? -1 : b.File < a.File ? 1 : a.CommIndex - b.CommIndex;
            return (isNaN(Date1) && isNaN(Date2) === true) ? stability : isNaN(Date1) ? 1 : isNaN(Date2) ? -1 : Date2 - Date1;
        });
    }

    for (let i = 0; i < list.length; i++) {
        if (list[i].Imp !== 0)
            arrOutput[i + 1] = "  !  " + "|  " + list[i].Name + ' '.repeat(name_len - list[i].Name.length) +
            "  |  " + list[i].Date + ' '.repeat(date_len - list[i].Date.length) +
            "  |  " + list[i].Comment + ' '.repeat(comm_len - list[i].Comment.length) +
            "  |  " + list[i].File + ' '.repeat(file_len - list[i].File.length) + "  ";
        else
            arrOutput[i + 1] = "     " + "|  " + list[i].Name + ' '.repeat(name_len - list[i].Name.length) +
            "  |  " + list[i].Date + ' '.repeat(date_len - list[i].Date.length) +
            "  |  " + list[i].Comment + ' '.repeat(comm_len - list[i].Comment.length) +
            "  |  " + list[i].File + ' '.repeat(file_len - list[i].File.length) + "  ";
    }
    name_len = 4;
    date_len = 4;
    comm_len = 7;
    file_len = 8;
    return arrOutput;
}

function date(command) {
    var arrOutput = [];
    var msUTC = Date.parse(command);
    var counter = 1;
    for (let i = 0; i < arrComment.length; i++) {
        if (msUTC <= Date.parse(arrDate[i])) {
            if (arrName[i].length > name_len)
                name_len = arrName[i].length;
            if (arrDate[i].length > date_len)
                date_len = arrDate[i].length;
            if (arrComment[i].length > comm_len)
                comm_len = arrComment[i].length;
            if (arrFile[i].length > file_len)
                file_len = arrFile[i].length;
        }
    }


    arrOutput[0] = "  !  " + "|  " + arrName[0] + ' '.repeat(name_len - arrName[0].length) +
        "  |  " + arrDate[0] + ' '.repeat(date_len - arrDate[0].length) +
        "  |  " + arrComment[0] + ' '.repeat(comm_len - arrComment[0].length) +
        "  |  " + arrFile[0] + ' '.repeat(file_len - arrFile[0].length) + "  ";

    for (let i = 1; i < arrComment.length; i++) {
        if (msUTC <= Date.parse(arrDate[i])) {
            if (arrImp[i] !== 0)
                arrOutput[counter] = "  !  " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
                "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
                "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
                "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
            else
                arrOutput[counter] = "     " + "|  " + arrName[i] + ' '.repeat(name_len - arrName[i].length) +
                "  |  " + arrDate[i] + ' '.repeat(date_len - arrDate[i].length) +
                "  |  " + arrComment[i] + ' '.repeat(comm_len - arrComment[i].length) +
                "  |  " + arrFile[i] + ' '.repeat(file_len - arrFile[i].length) + "  ";
            counter++;
        }
    }
    name_len = 4;
    date_len = 4;
    comm_len = 7;
    file_len = 8;
    return arrOutput;
}

function writeLine(Output) {
    var stringLength = Output[0].length;
    var firstArrElem = Output.splice(0, 1);
    var ifArrNotNull = Output[0] === undefined ? '' : ('\n' + Output.join('\n') + '\n' +
    												   '-'.repeat(Output[0].length));
    console.log(firstArrElem + '\n' + '-'.repeat(stringLength) + ifArrNotNull);
}