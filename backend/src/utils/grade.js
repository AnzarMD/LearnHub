const scoreToGrade = (p) => p>=90?"A+":p>=80?"A":p>=70?"B+":p>=60?"B":p>=50?"C":p>=40?"D":"F";
const calcAttendancePct = (present, total) => total === 0 ? 0 : Math.round((present / total) * 10000) / 100;
module.exports = { scoreToGrade, calcAttendancePct };
