import moment from 'moment'

export default function createMonthJson(count, dateFormat, calendarCollectionData) {
    let totalDaysInMonth = moment().add(count, 'month').daysInMonth()

    // console.log(totalDaysInMonth);

    let temp = Array(totalDaysInMonth).fill().map((_, ind) => moment().add(count, 'month').date(ind + 1))

    // console.log(temp)

    let startWeekdayOfCalendar = "Monday"

    let finalData = []

    temp.map(obj => {

        // console.log(dateFormat);

        let objWeekdayName = obj?.format('dddd')

        if (finalData.length) {

            let lastObj = finalData[finalData.length - 1]

            if (
                objWeekdayName?.toUpperCase().includes(startWeekdayOfCalendar?.toUpperCase())
            ) {

                let ryo = {}

                ryo[objWeekdayName] = {
                    date: obj?.format(dateFormat)
                }

                finalData.push(ryo)

            }
            else {

                lastObj[objWeekdayName] = {
                    date: obj?.format(dateFormat)
                }

            }

        }
        else {

            let z = {}
            z[obj?.format('dddd')] = {
                date: obj?.format(dateFormat)
            }
            finalData.push(z)

        }
    })

    // 
    let filterCond = `${moment().add(count, 'month').format('MMMM')}_${moment().add(count, 'month').year()}`
    // console.log(filterCond);
    let filteredCollection = calendarCollectionData?.filter(e => {
        for (let key in e) {
            if (key == filterCond) {
                return e
            }
        }
    })
    // console.log(filteredCollection);
    let respData = finalData?.map((o, i, a) => {
        // console.log(o);

        let temp = { ...o }

        for (const key in temp) {
            // console.log(o[key]);
            let ifDateExists;

            if (
                filteredCollection.length == 1
            ) {
                ifDateExists = filteredCollection[0][filterCond]?.find(e => e?.date == temp[key]['date'])
            }
            // console.log(ifDateExists && ifDateExists['tasks']);
            // console.log(ifDateExists && Object.keys(ifDateExists).length);

            if (
                ifDateExists && Object.keys(ifDateExists).length
            ) {
                temp[key]['tasks'] = ifDateExists['tasks']
                // console.log(ifDateExists['tasks']);
                // return o
            }
        }
        // console.log(temp)
        return temp
    })

    return respData
}