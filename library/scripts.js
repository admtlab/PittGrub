 const lib = {

  _formatMinute: (minute) => {
    if(minute < 10) {
        return '0'+minute
    } else return minute
  },

  _formatHour: (hour) => {
    if(hour == 0) {
        return 12
    } else return hour
  },

  _convertHoursMin: (date) => {
      var hour = date.getHours();
      var min = date.getMinutes();
      var time = 'am'
      if(hour > 12) {
          hour = hour - 12;
          time = 'pm'
      }
      return lib._formatHour(hour) + ':' + lib._formatMinute(min) + ' ' + time
  },

  _convertDate: (date) => {
    var month = date.getMonth();
    var day = date.getDate();
    return month + '/' +day+' 🕰️ '+lib._convertHoursMin(date)
  }
 }

 export default lib