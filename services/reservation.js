const Reservation = require('../models/reservation');
const moment = require('moment-timezone')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cluster = require('../models/cluster');

setInterval(() => {
    start()
}, 5000)

const start = () => {
Reservation.findOne({
    where: {
        startDate: {[Op.lt]: moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')},
        status: {[Op.eq]: 'notapplied'}
    }, include: Cluster 

})
.then(
   reservation => {
       if (reservation) {
           console.log('Clustername '+reservation.cluster.clustername)
           reservation.update(
               {
                   status: 'error'
               }
           )
       }
       else {
           console.log('No reservation found')
       }
   } 
)


}