const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const lib = {

  _formatMinute: (minute) => {
    if (minute < 10) {
      return '0' + minute
    } else return minute
  },

  _formatHour: (hour) => {
    if (hour == 0) {
      return 12
    } else return hour
  },

  _convertHoursMin: (date) => {
    var hour = date.getHours();
    var min = date.getMinutes();
    var time = 'am'
    if (hour > 12) {
      hour = hour - 12;
      time = 'pm'
    }
    return lib._formatHour(hour) + ':' + lib._formatMinute(min) + ' ' + time
  },

  _convertDate: (date) => {
    return date.getMonth() + 1 + "/" + date.getDate() + ' 🕰 ' + lib._convertHoursMin(date);
    // var month = date.getMonth();
    // var day = date.getDate();
    // return month + '/' +day+' 🕰️ '+lib._convertHoursMin(date)
  },

  _convertDate_getMonthDay: (date) => {
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();
    // var month = date.getMonth();
    // var day = date.getDate();
    // return month + '/' +day;
  },

  _mapFoodPreferencesToArray: (array) => {
    // id = 0 - vegetarian
    // id = 1 - vegan
    // id = 2 - gluten free
    // id = 3 - no peanuts
    var arr = Array(4).fill(false);
    for (foodPrefObj of array) {
      arr[foodPrefObj.id] = true;
    }
    return arr;
  },

  _mapArraytoFoodPreferenceObjects: (array) => {
    var obj =
      [
        {
          id: 0,
          name: 'Vegetarian',
          description: 'No meat'
        },
        {
          id: 1,
          name: 'Vegan',
          description: 'No dairy, no meat'
        },
        {
          id: 2,
          name: 'Gluten-free',
          description: 'not a real thing'
        },
        {
          id: 3,
          name: 'No peanuts',
          description: 'No peanuts...'
        }
      ]
    var arr = Array();
    for (i = 0; i < array.length; i++) {
      var index = arr[i];
      arr.push(obj[index])
    }
    return arr
  }

}

export default lib
