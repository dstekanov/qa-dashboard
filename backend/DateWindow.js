const moment = require('moment');

class DateWindow {
  constructor(windowSize = 14) {
    this.windowSize = windowSize;
    this.dates = [];
    this.dataMap = new Map();
  }

  add(date, data) {
    // If we already have this date, just update the data
    if (this.dataMap.has(date)) {
      this.dataMap.set(date, data);
      return null; // No date was removed
    }

    // if date is less than 14 days ago, return null
    if (moment(date, 'DD/MM/YYYY').isBefore(moment().subtract(14, 'days'))) {
        return { error: `Date Window is ${this.windowSize} days, you cannot update results for older dates` };
    }

    // Add new date and data
    this.dates.push(date);
    this.dataMap.set(date, data);

    // If we exceed window size, remove oldest
    let removedDate = null;
    if (this.dates.length > this.windowSize) {
      removedDate = this.dates.shift(); // Remove oldest date
      this.dataMap.delete(removedDate);
    }

    return removedDate; // Return removed date or null
  }

  get(date) {
    return this.dataMap.get(date);
  }

  getAllDates() {
    return [...this.dates];
  }

  getAllData() {
    const result = {};
    this.dates.forEach(date => {
      result[date] = this.dataMap.get(date);
    });
    return result;
  }

  // Helper method to check if a date should be in the window
  isInWindow(date) {
    if (this.dates.length === 0) return true;
    const momentDate = moment(date, 'DD/MM/YYYY');
    const oldestDate = moment(this.dates[0], 'DD/MM/YYYY');
    const newestDate = moment(this.dates[this.dates.length - 1], 'DD/MM/YYYY');
    
    return momentDate.isSameOrAfter(oldestDate) && 
           momentDate.isSameOrBefore(newestDate);
  }
}

module.exports = DateWindow; 