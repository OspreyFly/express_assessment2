function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

function convertHour(hour) {
    const ones = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

    if(hour >= 12){
        hour -= hour;
    }

    return ones[hour];
}

function convertMinute(minute) {
    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];

    // Check for zero minutes
    if(minute < 1){
        return "o'clock";
    }

    // Check for zero in tens place
    if(minute < 10 && minute != 0){
        return `oh ${ones[minute]}`;
    }

    // Check for 1 in tens place or twenty
    if (minute <= 20) {
        return ones[minute];
    } else {
        return tens[Math.floor(minute / 10)] + (minute % 10? ' ' + ones[minute % 10] : '');
    }
}

function convertTimeString(timeString) {
    let { hours, minutes } = parseTime(timeString);
    let amPm = 'am';

    // Check AM/PM
    if (hours >= 12) {
        amPm = 'pm';
        if (hours > 12) {
            hours -= 12;
        }
    }

    const hourWords = convertHour(hours);
    const minuteWords = convertMinute(minutes);

    // Check for midnight and noon
    if(hourWords == "twelve" && minuteWords == "o'clock"){
        if(amPm == 'am'){
            return 'midnight';
        }else{
            return 'noon';
        }
    }

    return `${hourWords} ${minuteWords} ${amPm}`;
}

module.exports = {
    convertTimeString: convertTimeString,
};