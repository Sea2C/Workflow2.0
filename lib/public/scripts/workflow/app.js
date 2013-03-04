(function ($, Backbone, dust, moment) {

    // todo: figure out a better way to do templates
    var Templates = {
        load: function (url, callback) {
            $.ajax({
                url: url,
                method: 'GET',
                async: false,
                complete: function (xhr, status) {
                    callback(xhr.responseText);
                }
            });
        },
        get: function (name, url, callback) {
            var me = this,
                loaded = [],
                remotes = {},
                templates = (me.templates = me.templates || {});

            if (typeof url === 'function') {
                callback = url;
                remotes = name;
            } else {
                remotes[name] = url;
            }

            (function load(names) {
                var name = names.shift();
                
                if (!name) {
                    return callback();
                } else if (!(template = templates[name])) {
                    me.load(remotes[name], (function (n, v) {
                        return function (template) {
                            dust.loadSource(dust.compile(template, n));
                            load(v);
                        };
                    } (name, names)));
                } else {
                    load(names);
                }
            } (Object.keys(remotes)));
        }
    };

    var Appointment = Backbone.Model.extend({
        urlRoot: '/appointments'
    });

	var AppointmentCollection = Backbone.Collection.extend({
		model: Appointment,
		url: '/appointments'
	});
	
    var AppointmentViewModel = Appointment.extend({
        initialize: function (attributes) {
            var m,
                date,
                offset,
                me = this;
            
            if ((date = attributes.date)) {
                m = moment(date);
                me.set({
                    date: m.format('YYYY-MM-DD'),
                    datetime: attributes.date,
                    time: m.format('HH:mm')
                });
            }
        }
    });

	var AppointmentListViewModel = Appointment.extend({
		initialize: function(attributes){
            var m,
                date,
                offset,
                me = this;
            
            if ((date = attributes.date)) {
                m = moment(date);
                me.set({
                    date: m.format('YYYY-MM-DD'),
                    datetime: attributes.date,
                    time: m.format('HH:mm')
                });
            }
		}
	});

	var AppointmentListViewModelCollection = AppointmentCollection.extend({
		model: AppointmentListViewModel
	});
	
	var AppointmentList = Backbone.View.extend({
		events: { 
			'click .rowData': 'rowClick',
			'click .delete': 'deleteRow'
		},
		deleteRow: function(e){
			var currentId = $(e.currentTarget).closest('tr').attr('data-row');
			this.trigger('delete',currentId);
			return false;
		},
		rowClick: function(e){
			var currentId = e.currentTarget.attributes['data-row'].value;
			this.trigger('navigate',currentId);
		},
		render: function() {
            var me = this,
                model = me.model.toJSON();
            
            dust.render('appointmentList', {appointments: model}, function (error, output) {
                if (error) {
                    console.log(arguments);
                    alert('An unexpected rendering error has occurred');
                    return;
                }

                $(me.el).html(output);
            });
            return me;
		}
	});
	
    var AppointmentView = Backbone.View.extend({
        events: {
            "click .submit": 'submit'
        },
        render: function () {
            var me = this,
                model = me.model.toJSON();
            
            dust.render('appointment', model, function (error, output) {
                if (error) {
                    console.log(arguments);
                    alert('An unexpected rendering error has occurred');
                    return;
                }

                $(me.el).html(output);
            });

            return me;
        },
        submit: function () {
            var me = this,
                model = me.model;
            
            model.set(me.serialize());
            model.save(model.toJSON(),{success: function(){ me.trigger('navigate'); }});
        },
        serialize: function () {
            var me = this,
                m = moment(me.$('#date').val()),
                time = me.$('#time').val().split(':');

            m.hours(+time[0]);
            m.minutes(+time[1]);

            return {
                title: me.$('#title').val(),
                date: m.utc().format(),
                description: me.$('#description').val(),
                timezoneOffset: (new Date()).getTimezoneOffset()
            };
        }
    });

    var AppointmentRouter = Backbone.Router.extend({
        routes: {
            'appointments': 'list',
			'appointments/create': 'create',
            'appointments/:id': 'view',
            '*path': 'list'
        },
        create: function () {
			var me = this;
			var view = new AppointmentView({
                model: new Appointment()
            }).render();
			view.on('navigate',function(){ me.navigate('appointments',true) });
            this.replace(view.$el);
        },
		list: function(){
			var me = this;
			var model = new AppointmentListViewModelCollection();
			model.fetch({
                success: function () {
					var view = new AppointmentList({
                        model: model
                    }).render();
					view.on('navigate',function(id){me.navigate('appointments/' + id,true)});
					view.on('delete',function(id){
							var modelToDelete = new Appointment({ id: id});
							modelToDelete.destroy({success: function(){ me.list(); }});
					});
                    // todo: revisit this for our date and time overrides
                    me.replace(view.$el);
                }
            });
		},
        view: function (id) {
			var me = this,
                model = new Appointment({ id: id });
            
            model.fetch({
                success: function () {
					var view = new AppointmentView({
                        model: new AppointmentViewModel(model.attributes)
                    }).render();
					view.on('navigate',function(){ me.navigate('appointments',true) });
					me.replace(view.$el);
                    // todo: revisit this for our date and time overrides
                }
            });
        },
        replace: function (content) {
            var me = this;
            (me.target = me.target || $('#content')).html(content);
        }
    });

    Templates.get({
        appointment: 'templates/appointments/view.dust',
        appointmentList: 'templates/appointments/list.dust'
    }, function () {
        $(function () {
            var appointmentRouter = new AppointmentRouter();
            Backbone.history.start({ pushState: false, root: '/app' });
        });
    });

} (window.jQuery || window.Zepto, window.Backbone, window.dust, window.moment));