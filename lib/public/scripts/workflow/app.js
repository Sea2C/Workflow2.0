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
            var template,
                me = this,
                templates = (me.templates = me.templates || {});

            if ((template = templates[name])) {
                return template;
            }

            me.load(url, function (template) {
                callback(templates[name] = template);
            });
        }
    };

    var Appointment = Backbone.Model.extend({
        urlRoot: '/appointments'
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
            model.save();
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
            'appointments/create': 'create',
            'appointments/:id': 'view',
            '*path': 'create'
        },
        create: function () {
            this.replace(new AppointmentView({
                model: new Appointment()
            }).render().$el);
        },
        view: function (id) {
            var me = this,
                model = new Appointment({ id: id });
            
            model.fetch({
                success: function () {
                    // todo: revisit this for our date and time overrides
                    me.replace(new AppointmentView({
                        model: new AppointmentViewModel(model.attributes)
                    }).render().$el);
                }
            });
        },
        replace: function (content) {
            var me = this;
            (me.target = me.target || $('#content')).html(content);
        }
    });

    Templates.get('appointment', 'templates/appointment.dust', function (template) {
        dust.loadSource(dust.compile(template, 'appointment'));
        
        $(function () {
            var appointmentRouter = new AppointmentRouter();
            Backbone.history.start({ pushState: false, root: '/app' });
        });
    });

} (window.jQuery || window.Zepto, window.Backbone, window.dust, window.moment));