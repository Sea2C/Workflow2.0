var appointments = {};

exports.list = function (page, pageSize, callback) {
    var results = Object.keys(appointments).splice((page - 1) * pageSize, pageSize).map(function (id) {
        return appointments[id];
    });

    callback(null, results);
};

exports.findById = function (id, callback) {
    return callback(null, appointments[id]);
};

exports.create = function (appointment, callback) {
	var id = Object.keys(appointments).length > 0 ? Math.max.apply(Math, Object.keys(appointments))+1 : 1;
	return callback(null, (appointments[(appointment.id = id)] = appointment));
};

exports.update = function (appointment, callback) {
    var id = appointment.id;
    return callback(null, (appointments[id] = appointment));
};

exports.delete = function (appointment, callback) {
    var id = appointment.id,
        persisted = appointments[id];

    if (persisted) {
        delete appointments[id];
    }
    
    callback(null, !!persisted);
};